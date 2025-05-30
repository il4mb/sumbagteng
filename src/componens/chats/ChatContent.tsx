'use client'
import { Message } from './ChatProvider';
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import MessageFragment from './MessageFragment';

export interface IChatContentProps {
    messages: Message[];
}

export default function ChatContent({ messages }: IChatContentProps) {

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, }}>
            {messages.map((message) => (
                <MessageFragment key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
}