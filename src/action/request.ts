"use server"

import { DesignFormData } from "@/componens/client/RequestForm/DesignForm";
import { ProductionFormData } from "@/componens/client/RequestForm/ProductionForm";
import { adminDb, adminStorage } from "@/firebase/config-admin";
import { uploadFile } from "@/lib/s3-client";
import { getSession } from "@/lib/session";
import { ApiResponse, DesignRequest, ProductionRequest } from "@/types"
import { randomUUID } from "crypto";

type CompletionProps = {
    id: string;
    type: "design" | "production";
    file: File;
    message?: string;
}
export const SubmitCompletion = async (props: CompletionProps): Promise<ApiResponse> => {
    try {
        const user = await getSession();
        if (!user) {
            return {
                status: false,
                message: "401: Unathorized"
            }
        }
        const db = adminDb;
        const { file, message, type } = props;

        const docRef = db.doc(`${type}s/${props.id}`);
        const docSnapshoot = await docRef.get();
        if (!docSnapshoot.exists) {
            return {
                status: false,
                message: "404: Document not found!"
            }
        }
        if (type == "design" && message) {
            const chat = {
                sendBy: user.uid,
                sendAt: new Date(),
                read: false,
                content: message
            }
            const chatRef = docRef.collection("chats");
            await chatRef.add(chat);

            const objectKey = `${type}s/${Date.now()}-${props.id}.webp`;
            const buffer = Buffer.from(await file.arrayBuffer());
            await uploadFile(buffer, objectKey);

            const completedRef = docRef.collection("completions");
            await completedRef.add({
                image: objectKey,
                message,
                completedAt: new Date()
            });
        }

        return {
            status: true,
            message: "Action success"
        }



    } catch (error: any) {
        console.log(error);
        return {
            status: false,
            message: error.message || "Caught an Error"
        }
    }

}


type AddRequestProps = | { type: "design"; data: DesignFormData } | { type: "production"; data: ProductionFormData };

export const AddRequest = async (props: AddRequestProps) => {
    try {
        const user = await getSession();
        if (!user) return {
            status: false,
            message: "401: Unathorized"
        }
        const db = adminDb;

        if (props.type === "design") {

            const { name, size, images, description, theme, type: designType } = props.data;
            const imageFiles = images.filter(e => e.type == "upload");
            const imageUploadPromises = imageFiles.map(async f => {
                const file = f.file;
                if (!file) return;
                const objectKey = `design/${Date.now()}-${randomUUID()}.webp`;
                const buffer = Buffer.from(await file.arrayBuffer());
                await uploadFile(buffer, objectKey);
                return objectKey;
            });

            const uploadedUrls = (await Promise.all(imageUploadPromises)).filter(e => typeof e == "string");
            const imagesUrls: string[] = [...uploadedUrls, ...(imageFiles.filter(e => e.type == 'url').map(e => e.value))].filter(Boolean);

            const design: Omit<DesignRequest, "id"> = {
                images: imagesUrls,
                createdBy: user.uid,
                createdAt: new Date(),
                status: 'pending',
                name,
                size,
                theme,
                type: designType as any,
                description
            }

            const designRef = db.collection("designs");
            await designRef.add(design);

            return {
                status: true,
                message: "Action success"
            }

        } else if (props.type === "production") {
            const { location, cluster, allocation, quantity, designRef, description } = props.data;

            const request = { location, cluster, allocation, quantity, description, design: {} }
            if (designRef.type == "upload") {
                const objectKey = `production/${Date.now()}-${randomUUID()}.webp`;
                const buffer = Buffer.from(await designRef.value.arrayBuffer());
                await uploadFile(buffer, objectKey);
                request.design = {
                    type: 'upload',
                    value: objectKey
                }
            } else {
                request.design = {
                    type: 'design',
                    value: designRef.value
                }
            }

            const productionRef = db.collection("productions");
            await productionRef.add({
                ...request,
                createdBy: user.uid,
                createdAt: new Date(),
                status: 'pending',
            });

            return {
                status: true,
                message: "Action success"
            }
        }

    } catch (error: any) {
        console.log(error);
        return {
            status: false,
            message: error.message || "Caught an Error"
        }
    }
};
