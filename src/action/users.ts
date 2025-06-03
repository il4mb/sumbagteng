"use server"

import { adminDb, adminAuth } from "@/firebase/config-admin";
import { uploadFile } from "@/lib/s3-client";
import { getSession } from "@/lib/session";
import { randomUUID } from "crypto";

type SUser = {
    id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "client"
};

export async function AddUser({ name, email, photo, password }: Omit<SUser, "id"> & { password: string; }) {
    const session = await getSession();
    if (session?.role !== "admin") {
        return { status: false, message: "Permission denied" };
    }

    try {
        // Create user in Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
            photoURL: photo,
        });

        await adminDb
            .collection("users")
            .doc(userRecord.uid)
            .set({
                name,
                email,
                photo,
                createdAt: new Date().toISOString(),
            });

        return {
            status: true,
            message: "User created successfully",
            data: {
                id: userRecord.uid
            }
        };
    } catch (error: any) {
        return {
            status: true,
            message: error.message || "Caught an Error",
        };
    }
}

export async function DeleteUser(id: SUser["id"]) {
    const session = await getSession();
    if (session?.role !== "admin") {
        return { status: false, message: "Permission denied" };
    }

    if (!id) {
        return {
            status: false,
            message: "UID required!"
        }
    }

    const userAuth = await adminAuth.getUser(id);
    if (!userAuth) {
        return {
            status: false,
            message: 'user not found!'
        }
    }

    await adminAuth.deleteUser(id);
    await adminDb.collection("users").doc(id).delete();

    return {
        status: true,
        message: "User removed successfully"
    };
}

export async function ListUser() {

    const session = await getSession();
    if (session?.role !== "admin") {
        return { status: false, message: "Permission denied" };
    }

    const authUsers = await adminAuth.listUsers()

    const usersPromises = authUsers.users.map(async user => {
        const userRef = adminDb.doc(`users/${user.uid}`);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
            return {
                id: user.uid,
                name: user.displayName,
                photo: user.photoURL,
                email: user.email,
                ...userSnap.data()
            }
        }
        return {
            id: user.uid,
            name: user.displayName,
            photo: user.photoURL,
            email: user.email
        }
    })

    const users = await Promise.all(usersPromises);

    return {
        status: true,
        message: "Fetched user list successfully",
        data: users
    };
}

export async function UpdateUser(params: Partial<Omit<SUser, 'photo'> & { password: null | string, photo?: File | null, email?: string }> & { id: string }) {

    const session = await getSession();
    console.log(session?.uid, params.id)
    if (session?.uid !== params.id && session?.role !== "admin") {
        return { status: false, message: "Permission denied" };
    }

    const { id: uid, password, photo, ...rest } = params;
    const updateData: any = { ...rest };

    if (!uid) {
        return {
            status: false,
            message: "UID required!"
        }
    }
    const userAuth = await adminAuth.getUser(uid);

    if (!userAuth) {
        return {
            status: false,
            message: 'user not found!'
        }
    }

    if (password) {
        adminAuth.updateUser(uid, { password })
    }

    if (photo) {
        const objectKey = `photo/${Date.now()}-${randomUUID()}.webp`;
        const buffer = Buffer.from(await photo.arrayBuffer());
        await uploadFile(buffer, objectKey);
        updateData.photo = objectKey;
    }
    delete updateData.email;

    await adminDb.collection("users").doc(uid)
        .update({
            ...updateData,
            updatedAt: new Date()
        });

    return {
        status: true,
        message: "user updated successfully"
    };
}
