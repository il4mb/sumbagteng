import { Message } from './ChatProvider';
import { useAuth } from '../AuthProvider';
import {
    Box,
    Avatar,
    Typography,
    Stack,
    Divider,
    useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useRef } from 'react';

export interface IChatContentProps {
    messages: Message[];
}

export default function ChatContent({ messages }: IChatContentProps) {
    const { user } = useAuth();
    const theme = useTheme();
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
                <Box
                 key={message.id}
                    sx={{
                        display: 'flex',
                        justifyContent: message?.sendBy?.id === user?.uid ? 'flex-end' : 'flex-start',
                        mb: 2
                    }}>
                    <Stack
                        direction={message?.sendBy?.id === user?.uid ? 'row-reverse' : 'row'}
                        spacing={1}
                        alignItems="flex-end"
                        sx={{ maxWidth: '80%' }}>
                        {message?.sendBy?.id !== user?.uid && (
                            <Avatar
                                src={message?.sendBy?.photo}
                                alt={message?.sendBy?.name}
                                sx={{ width: 32, height: 32 }}
                            />
                        )}

                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: message?.sendBy?.id === user?.uid
                                    ? theme.palette.primary.main
                                    : theme.palette.background.paper,
                                color: message?.sendBy?.id === user?.uid
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.text.primary,
                                boxShadow: theme.shadows[1],
                                position: 'relative'
                            }}>
                            {message?.sendBy?.id !== user?.uid && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        fontWeight: 600,
                                        color: message?.sendBy?.id === user?.uid
                                            ? theme.palette.primary.light
                                            : theme.palette.text.secondary
                                    }}>
                                    {message?.sendBy?.name}
                                </Typography>
                            )}

                            <Typography variant="body1">{message.content}</Typography>

                            <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                                justifyContent="flex-end"
                                sx={{ mt: 0.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: '0.5rem',
                                        opacity: 0.8
                                    }}>
                                    {formatDistanceToNow(message.sendAt, { addSuffix: true })}
                                </Typography>

                                {message?.sendBy?.id === user?.uid && (
                                    <CheckCircleIcon
                                        fontSize="inherit"
                                        sx={{
                                            color: message.read
                                                ? theme.palette.success.main
                                                : theme.palette.grey[500],
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
}