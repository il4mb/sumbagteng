"use client"
import { Box, Stack, Typography, IconButton, styled, Tooltip, SxProps } from '@mui/material';
import { Chat, Message, User } from './ChatProvider';
import { Close, Minimize } from '@mui/icons-material';
import { DragControls, Reorder, useDragControls, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import ChatContent from './ChatContent';
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import ChatInput from './ChatInput';

export type ChatWindowOptions = {
    expand: boolean;
};
export interface IChatWindowProps {
    chat: Chat;
    options: ChatWindowOptions;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
}

export default function ChatWindow(props: IChatWindowProps) {
    const dragControls = useDragControls();
    const { chat, options, onMinimize, onMaximize, onClose } = props;
    const { expand } = options;
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const c = collection(db, "designs", chat.id, "chats");
        const q = query(c, orderBy("sendAt", "asc"))
        const unsub = onSnapshot(q, async (snap) => {
            const newMessagesPromise = snap.docs.map(async (snap) => {
                const data = snap.data() as Omit<Message, "sendBy" | "sendAt"> & { sendBy: string, sendAt: Timestamp };
                let sender: Message["sendBy"] = undefined;
                try {
                    const senderDoc = await getDoc(doc(db, "users", data.sendBy));
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
                return {
                    id: snap.id,
                    ...data,
                    sendAt: data.sendAt.toDate(),
                    sendBy: sender
                }
            });

            const newMessages = await Promise.all(newMessagesPromise);
            setMessages(newMessages);
        });
        return () => unsub();
    }, []);

    return (
        <Reorder.Item
            key={chat.id}
            value={chat}
            dragListener={false}
            dragControls={dragControls}
            style={{ listStyle: 'none' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}>
            <Box sx={WindowSx({ expand })}>
                <ChatWindowHeader
                    chat={chat}
                    expand={expand}
                    onMinimize={onMinimize}
                    onMaximize={onMaximize}
                    onClose={onClose}
                    dragControls={dragControls}/>

                <AnimatePresence>
                    {expand && (
                        <Stack sx={{ flex: 1, p: 2 }}>
                            <ChatContent messages={messages} />
                            <ChatInput chatId={chat.id} />
                        </Stack>
                    )}
                </AnimatePresence>
            </Box>
        </Reorder.Item>
    );
}

const WindowSx = ({ expand }: { expand: boolean }): SxProps => ({
    width: '100%',
    minWidth: expand ? 400 : 200,
    maxWidth: expand ? 400 : 200,
    minHeight: expand ? 600 : 0,
    background: "#2b2f36",
    borderRadius: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: 4,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
});

const ActionButton = styled(IconButton)({
    minWidth: 0,
    minHeight: 0,
    padding: 0,
    width: '1.5rem',
    height: '1.5rem',
});

type ChatWindowHeaderProps = {
    chat: Chat;
    expand: boolean;
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
    dragControls: DragControls
}

const ChatWindowHeader = (props: ChatWindowHeaderProps) => {
    const { chat, expand, dragControls, onMinimize, onMaximize, onClose } = props;

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => {
                if (expand) return
                onMaximize();
            }}
            onPointerDown={(e) => {
                e.preventDefault();
                dragControls.start(e);
            }}
            sx={{ px: 2, py: 1, cursor: expand ? 'grab' : "pointer", userSelect: 'none' }}>
            <Typography
                fontSize={16}
                fontWeight={600}>
                {chat.name}
            </Typography>

            {expand && (
                <Stack direction="row" spacing={1}>
                    <Tooltip title={"Minimize Window"} arrow>
                        <ActionButton size="small" sx={{ color: 'white' }} onClick={() => onMinimize()}>
                            <Minimize fontSize="small" />
                        </ActionButton>
                    </Tooltip>
                    <Tooltip title="Close Window" arrow>
                        <ActionButton size="small" sx={{ color: 'white' }} onClick={onClose}>
                            <Close fontSize="small" />
                        </ActionButton>
                    </Tooltip>
                </Stack>
            )}
        </Stack>
    )
}