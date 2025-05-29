"use client"
import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    getDocs,
    DocumentData,
    CollectionReference,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { User } from "firebase/auth";
import { useAuth } from "../AuthProvider";

interface Chat {
    id: string;
    message: string;
    createdAt: any;
    senderId: string;
    [key: string]: any;
}

interface Design {
    id: string;
    createdBy: string;
    executedBy?: string;
}

export const useUserChats = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (!user?.uid) return;

        const uid = user.uid;
        const designsRef = collection(db, "designs");

        const q1 = query(designsRef, where("createdBy", "==", uid));
        const q2 = query(designsRef, where("executedBy", "==", uid));

        const unsubscribes: (() => void)[] = [];

        const fetchChatsFromDesigns = async () => {
            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
            const allDesigns = [
                ...snap1.docs,
                ...snap2.docs.filter(d => !snap1.docs.some(s => s.id === d.id))
            ];

            allDesigns.forEach((designDoc: QueryDocumentSnapshot<DocumentData>) => {
                const designId = designDoc.id;
                const chatsRef = collection(db, "designs", designId, "chats");

                const unsub = onSnapshot(chatsRef, snapshot => {
                    const chatDocs = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as Chat));

                    setChats(prev => {
                        const filtered = prev.filter(chat => chat.designId !== designId);
                        return [...filtered, ...chatDocs];
                    });
                });

                unsubscribes.push(unsub);
            });
        };

        fetchChatsFromDesigns();

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [user?.uid]);

    return chats;
};
