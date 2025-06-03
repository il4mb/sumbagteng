"use client"

import { CheckCircle } from "@mui/icons-material";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { Message } from "./ChatProvider";
import { useAuth } from "../AuthProvider";
import { formatDistanceToNow } from "date-fns";

export interface IMessageFragmentProps {
    message: Message;
}

export default function MessageFragment({ message }: IMessageFragmentProps) {

    const { user } = useAuth();
    const theme = useTheme();

    return (
        <Box
            key={message.id}
            sx={{
                display: 'flex',
                justifyContent: message?.sendBy?.id === user?.id ? 'flex-end' : 'flex-start',
                mb: 2
            }}>
            <Stack
                direction={message?.sendBy?.id === user?.id ? 'row-reverse' : 'row'}
                spacing={1}
                alignItems="flex-end"
                sx={{ maxWidth: '80%' }}>
                {message?.sendBy?.id !== user?.id && (
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
                        bgcolor: message?.sendBy?.id === user?.id
                            ? theme.palette.primary.main
                            : theme.palette.background.paper,
                        color: message?.sendBy?.id === user?.id
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                        boxShadow: theme.shadows[1],
                        position: 'relative'
                    }}>
                    {message?.sendBy?.id !== user?.id && (
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                fontWeight: 600,
                                color: message?.sendBy?.id === user?.id
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

                        {message?.sendBy?.id === user?.id && (
                            <CheckCircle
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
    );
}
