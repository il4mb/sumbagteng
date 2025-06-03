"use client";
import { SendRounded } from '@mui/icons-material';
import { IconButton, Stack, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface IChatInputProps {
    chatId: string;
}

function ChatInput({ chatId }: IChatInputProps) {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendChat = async () => {
        if (!user || !message.trim()) return;

        setLoading(true);
        try {
            const chat = {
                content: message.trim(),
                sendBy: user.id,
                sendAt: Timestamp.now(),
                read: false,
            };

            const coll = collection(db, "designs", chatId, "chats");
            await addDoc(coll, chat);
            setMessage("");
        } catch (err) {
            console.error("Failed to send message:", err);
            // Optional: Show a snackbar or error state
        }
        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChat();
        }
    };

    return (
        <Stack direction="row" gap={1.4}>
            <TextField
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={3}
                sx={{ flex: 1 }}
                placeholder="Type a message..."
            />

            <IconButton
                onMouseDown={sendChat}
                disabled={loading || !message.trim()}
                sx={{
                    borderRadius: '3rem',
                    rotate: '-45deg',
                    top: -1,
                    color: message.trim() ? 'primary.main' : 'grey.400',
                }}>
                <SendRounded />
            </IconButton>
        </Stack>
    );
}


export default memo(ChatInput);