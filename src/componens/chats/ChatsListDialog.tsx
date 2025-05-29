'use client';

import { Close, QuestionAnswerRounded } from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Tooltip,
    List,
    ListItem,
    Avatar,
    Badge,
    Typography,
    Box
} from '@mui/material';
import { useState } from 'react';
import { useChat } from './ChatProvider';

interface IChatsDialogProps { }


export default function ChatsListDialog(props: IChatsDialogProps) {
    const [open, setOpen] = useState(false);
    const { chats, openChatWindow } = useChat();

    return (
        <>
            <Tooltip title="Open chat" arrow>
                <IconButton onClick={() => setOpen(!open)} color="primary" size="large">
                    <Badge badgeContent={chats.length} color="error">
                        <QuestionAnswerRounded />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: {
                        sx: {
                            height: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'fixed',
                            top: 0,
                            right: 0,
                        },
                    },
                }}>
                <DialogTitle component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component={'div'} variant="h6">Messages</Typography>
                    <IconButton edge="end" onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    <List sx={{ gap: 1 }} dense>
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <ListItem key={chat.id}
                                    onClick={() => (openChatWindow(chat), setOpen(false))}
                                    sx={{
                                        transition: 'all 0.2s ease-in-out',
                                        cursor: 'pointer',
                                        background: '#00000044',
                                        py: 1,
                                        borderRadius: 1,
                                        "&:hover": {
                                            transform: 'scale(1.01)',
                                            background: '#ffffff44',
                                        }
                                    }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar>{chat.name.charAt(0)}</Avatar>
                                        {chat.lastMessage && !chat.lastMessage?.read && (
                                            <Badge
                                                badgeContent={""}
                                                color="error"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    scale: 0.8
                                                }} />
                                        )}
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                        <Typography fontWeight={700} fontSize={18}>
                                            {chat.name}
                                        </Typography>
                                        {chat.lastMessage && (
                                            <Typography color="text.secondary">
                                                <Typography component={"span"} sx={{ fontWeight: 700 }}>{chat.lastMessage?.sendBy?.name || "Unknown"}: </Typography>
                                                {chat.lastMessage.content}
                                            </Typography>
                                        )}
                                    </Box>

                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ p: 2 }} color="text.secondary">
                                No chats available
                            </Typography>
                        )}
                    </List>
                </Box>
            </Dialog>
        </>
    );
}
