"use client";

import {
    useState,
    createContext,
    useContext,
    ReactNode,
    useEffect,
    useCallback,
    useMemo,
} from "react";
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
    Timestamp,
} from "firebase/firestore";
import { Box } from "@mui/material";
import { AnimatePresence, Reorder } from "framer-motion";
import { db } from "@/firebase/config";
import { useAuth } from "../AuthProvider";
import ChatWindow, { ChatWindowOptions } from "./ChatWindow";
import { useSnackbar } from "notistack";

// Type definitions
export type User = {
    id: string;
    name: string;
    photo: string;
};

export type Message = {
    id?: string;
    sendBy?: User;
    sendAt: Date;
    content: string;
    read: boolean;
};

export type Chat = {
    id: string;
    name: string;
    participants: string[];
    lastMessage?: Message;
};

type OpenedChat = {
    chat: Chat;
    options: ChatWindowOptions;
};

type ChatContextType = {
    chats: Chat[];
    openChatWindow: (chat: Chat | string) => void;
    closeChatWindow: (chatId: string) => void;
    minimizeChatWindow: (chatId: string) => void;
    maximizeChatWindow: (chatId: string) => void;
};

const ChatContext = createContext<ChatContextType>({
    chats: [],
    openChatWindow: () => { },
    closeChatWindow: () => { },
    minimizeChatWindow: () => { },
    maximizeChatWindow: () => { },
});

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
    children: ReactNode;
}

export default function ChatProvider({ children }: ChatProviderProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [openedChats, setOpenedChats] = useState<OpenedChat[]>([]);

    // Process chat snapshot data
    const processChatSnapshot = useCallback(async (
        docId: string,
        designName: string,
        participants: string[],
        lastMessage?: Omit<Message, "sendBy" | "sendAt"> & { sendBy: string; sendAt: Timestamp }
    ): Promise<Chat> => {
        let sender: User | undefined;

        if (lastMessage?.sendBy) {
            try {
                const senderDoc = await getDoc(fireDoc(db, "users", lastMessage.sendBy));
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

        return {
            id: docId,
            name: designName,
            participants,
            lastMessage: lastMessage ? {
                ...lastMessage,
                sendBy: sender,
                sendAt: lastMessage.sendAt.toDate(),
            } : undefined,
        };
    }, []);

    // Update chats state with proper sorting
    const updateChats = useCallback((newChat: Chat) => {
        setChats(prevChats => {
            const updatedChats = prevChats
                .filter(chat => chat.id !== newChat.id)
                .concat(newChat)
                .sort((a, b) => (
                    (b.lastMessage?.sendAt?.getTime() || 0) -
                    (a.lastMessage?.sendAt?.getTime() || 0)
                ));
            return updatedChats;
        });
    }, []);

    // Subscribe to user's chats
    useEffect(() => {
        if (!user?.id) return;

        const uid = user.id;
        const designsRef = collection(db, "designs");
        const userDesignsQuery = query(
            designsRef,
            where("status", "!=", "pending"),
            where("createdBy", "==", uid)
        );
        const executedDesignsQuery = query(
            designsRef,
            where("status", "!=", "pending"),
            where("executedBy", "==", uid)
        );

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
                const lastMessageQuery = query(
                    chatsRef,
                    orderBy("sendAt", "desc"),
                    limit(1)
                );

                const unsub = onSnapshot(lastMessageQuery, async (chatSnap) => {
                    const lastMsg = chatSnap.docs[0]?.data() as
                        Omit<Message, "sendBy" | "sendAt"> & {
                            sendBy: string;
                            sendAt: Timestamp
                        };

                    const chat = await processChatSnapshot(
                        designId,
                        designName,
                        participants,
                        lastMsg
                    );
                    updateChats(chat);
                });

                unsubscribes.push(unsub);
            }
        };

        const unsub1 = onSnapshot(userDesignsQuery, processSnapshot);
        const unsub2 = onSnapshot(executedDesignsQuery, processSnapshot);

        return () => {
            unsub1();
            unsub2();
            unsubscribes.forEach(unsub => unsub());
        };
    }, [user?.id, processChatSnapshot, updateChats]);

    // Chat window handlers
    const closeChatWindow = useCallback((chatId: string) => {
        setOpenedChats(prev => prev.filter(chat => chat.chat.id !== chatId));
    }, []);

    const openChatWindow = useCallback((chat: Chat | string) => {
        const findChat = (id: string) => chats.find(c => c.id === id);

        const expandChat = (chatToOpen: Chat) => {
            setOpenedChats(prev => {
                const filtered = prev.filter(e => e.chat.id !== chatToOpen.id);
                return [...filtered, { chat: chatToOpen, options: { expand: true } }];
            });
        };

        if (typeof chat === "string") {
            const foundChat = findChat(chat);
            if (foundChat) return expandChat(foundChat);
            enqueueSnackbar("Chat not found!", { variant: "error" });
            return;
        }

        expandChat(chat);
    }, [chats, setOpenedChats, enqueueSnackbar]);



    const minimizeChatWindow = useCallback((chatId: string) => {
        setOpenedChats(prev => prev.map(chat =>
            chat.chat.id === chatId
                ? { ...chat, options: { ...chat.options, expand: false } }
                : chat
        ));
    }, []);

    const maximizeChatWindow = useCallback((chatId: string) => {
        setOpenedChats(prev => prev.map(chat =>
            chat.chat.id === chatId
                ? { ...chat, options: { ...chat.options, expand: true } }
                : chat
        ));
    }, []);

    // Context value memoization
    const contextValue = useMemo(() => ({
        chats,
        openChatWindow,
        closeChatWindow,
        minimizeChatWindow,
        maximizeChatWindow,
    }), [chats, openChatWindow, closeChatWindow, minimizeChatWindow, maximizeChatWindow]);

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
            <AnimatePresence>
                <Box
                    component="div"
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        zIndex: 1300,
                        display: 'flex',
                        gap: 2,
                        px: 3,
                        alignItems: 'flex-end',
                    }}>
                    <Reorder.Group
                        axis="x"
                        values={openedChats.map(e => e.chat)}
                        onReorder={(chats) => {
                            const newOpenedChats: any[] = [];
                            chats.map(chat => {
                                const d = openedChats.find(e => e.chat.id == chat.id)
                                newOpenedChats.push({ chat, options: d?.options })
                            });
                            setOpenedChats(newOpenedChats);
                        }}
                        style={{
                            display: 'flex',
                            gap: '16px',
                            margin: 0,
                            padding: 0,
                            listStyle: 'none',
                            alignItems: "flex-end",
                        }}>
                        {openedChats.map(({ chat, options }) => (
                            <ChatWindow
                                key={chat.id}
                                chat={chat}
                                options={options}
                                onClose={() => closeChatWindow(chat.id)}
                                onMaximize={() => maximizeChatWindow(chat.id)}
                                onMinimize={() => minimizeChatWindow(chat.id)}
                            />
                        ))}
                    </Reorder.Group>
                </Box>
            </AnimatePresence>
        </ChatContext.Provider>
    );
}