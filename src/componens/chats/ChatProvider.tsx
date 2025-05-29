"use client";

import {
    useState,
    createContext,
    useContext,
    ReactNode,
    useEffect,
} from "react";
import { db } from "@/firebase/config";
import {
    collection,
    query,
    where,
    onSnapshot,
    DocumentData,
    orderBy,
    limit,
    QuerySnapshot,
    getDoc,
    doc as fireDoc,
    Timestamp
} from "firebase/firestore";
import { useAuth } from "../AuthProvider";
import { Box, Stack } from "@mui/material";
import ChatWindow from "./ChatWindow";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { Reorder } from "framer-motion";

export type Message = {
    id?: string;
    sendBy?: {
        id: string;
        name: string;
        photo: string;
    };
    sendAt: Date;
    content: string;
    read: boolean;
}
export type Chat = {
    id: string;
    name: string;
    participants: string[];
    lastMessage?: Message;
};
export type User = {
    id: string;
    name: string;
    photo: string;
}

type ChatContextType = {
    chats: Chat[];
    openChatWindow: (chat: Chat) => void;
    closeChatWindow: (chatId: string) => void;
};

const ChatContext = createContext<ChatContextType>({
    chats: [],
    openChatWindow() { },
    closeChatWindow() { }
});

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
    children: ReactNode;
}

export default function ChatProvider({ children }: ChatProviderProps) {
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [openedChats, setOpenedChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (!user?.uid) return;

        const uid = user.uid;
        const designsRef = collection(db, "designs");
        const q1 = query(designsRef, where("createdBy", "==", uid), where("status", "!=", "pending"));
        const q2 = query(designsRef, where("executedBy", "==", uid), where("status", "!=", "pending"));
        const seenIds = new Set<string>();
        const unsubscribes: (() => void)[] = [];

        const processSnapshot = async (snapshot: QuerySnapshot<DocumentData>) => {
            for (const doc of snapshot.docs) {
                if (seenIds.has(doc.id)) continue;
                seenIds.add(doc.id);

                const data = doc.data();
                const designId = doc.id;
                const designName = data.name || "Unnamed Design";
                const participants = [data.createdBy, data.executedBy].filter(Boolean);

                const chatsRef = collection(db, "designs", designId, "chats");
                const lastMessageQuery = query(chatsRef,
                    where("sendAt", "!=", null),
                    orderBy("sendAt", "desc"),
                    limit(1)
                );

                const unsub = onSnapshot(lastMessageQuery, async (chatSnap) => {
                    const lastMsg = chatSnap.docs[0]?.data() as Omit<Message, "sendBy" | "sendAt"> & { sendBy: string, sendAt: Timestamp };
                    let sender: Message["sendBy"] | undefined = undefined;
                    if (lastMsg) {
                        try {
                            const senderDoc = await getDoc(fireDoc(db, "users", lastMsg.sendBy));
                            if (senderDoc.exists()) {
                                const userData = senderDoc.data() as User;
                                sender = {
                                    id: senderDoc.id,
                                    name: userData.name,
                                    photo: userData.photo || '',
                                };
                            }
                        } catch (error) {
                            console.error("Failed to get sender info:", error);
                        }
                    }
                    setChats(prev => {
                        const updated = prev.filter(d => d.id !== designId);
                        return [...updated, {
                            id: designId,
                            name: designName,
                            participants,
                            lastMessage: lastMsg ? {
                                ...lastMsg,
                                sendBy: sender!,
                                sendAt: lastMsg.sendAt.toDate()
                            } : undefined,
                        }].sort((a, b) =>
                            (b.lastMessage?.sendAt?.getTime?.() || 0) - (a.lastMessage?.sendAt?.getTime?.() || 0)
                        );
                    });
                });

                unsubscribes.push(unsub);
            }
        };

        const unsub1 = onSnapshot(q1, processSnapshot);
        const unsub2 = onSnapshot(q2, processSnapshot);

        return () => {
            unsub1();
            unsub2();
            unsubscribes.forEach(unsub => unsub());
        };
    }, [user?.uid]);

    const closeChatWindow = (chatId: string) => {
        setOpenedChats(prev => prev.filter(chat => chat.id !== chatId));
    };

    const openChatWindow = (chat: Chat) => {
        setOpenedChats(prev => {
            if (prev.some(e => e.id == chat.id)) {
                return prev;
            }
            return [...prev, chat];
        });
    };


    return (
        <ChatContext.Provider value={{ chats, openChatWindow, closeChatWindow }}>
            {children}
            <AnimatePresence>
                <Box sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    zIndex: 1300,
                    display: 'flex',
                    gap: 2,
                    px: 3,
                    alignItems: 'flex-end'
                }}>
                    <Reorder.Group
                        axis="x"
                        values={openedChats}
                        onReorder={setOpenedChats}
                        style={{
                            display: 'flex',
                            gap: '16px',
                            margin: 0,
                            padding: 0,
                            listStyle: 'none',
                            alignItems: "flex-end"
                        }}>
                        {openedChats.map((chat) => (
                            <ChatWindow
                                key={chat.id}
                                chat={chat}
                                onClose={() => setOpenedChats(prev => prev.filter(c => c.id !== chat.id))}
                            />
                        ))}
                    </Reorder.Group>
                </Box>
            </AnimatePresence>
        </ChatContext.Provider>
    );
}