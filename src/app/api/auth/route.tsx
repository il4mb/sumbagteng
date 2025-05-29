import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/config-admin";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { status: "error", message: "Token is required" },
                { status: 400 }
            );
        }

        const decoded = await adminAuth.verifyIdToken(token);

        if (!decoded || !decoded.uid) {
            return NextResponse.json(
                { status: "error", message: "Invalid token" },
                { status: 401 }
            );
        }

        const userRecord = await adminAuth.getUser(decoded.uid);
        if (!userRecord) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }
        if (userRecord.disabled) {
            return NextResponse.json(
                { status: "error", message: "User is disabled" },
                { status: 403 }
            );
        }

        const userRef = adminDb.collection("users").doc(decoded.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return NextResponse.json(
                { status: "error", message: "User not found in database" },
                { status: 404 }
            );
        }

        const userData = userDoc.data();
        if (!userData || !userData.role) {
            return NextResponse.json(
                { status: "error", message: "User role not found" },
                { status: 403 }
            );
        }

        const sessionData = {
            uid: decoded.uid,
            email: decoded.email,
            role: userData.role,
            name: decoded.name || null,
        };

        await setSession(sessionData);

        return NextResponse.json(
            { status: "success", message: "Login successful", data: sessionData },
            { status: 200 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { status: "error", message: err.message || "Internal error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const res = NextResponse.json(
            { status: "success", message: "Logout successful" },
            { status: 200 }
        );

        res.cookies.set("session", "", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        });

        return res;
    } catch (err: any) {
        return NextResponse.json(
            { status: "error", message: err.message || "Internal error" },
            { status: 500 }
        );
    }
}
