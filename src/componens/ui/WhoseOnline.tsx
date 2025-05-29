"use client"
import socket from '@/socket';
import { User } from '@/types';
import { Avatar, Badge, Stack, Tooltip, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WhoseOnline() {
    const [users, setUsers] = useState<User[]>([
        {
            id: '123',
            name: 'Ilham B',
            role: 'admin'
        },
        {
            id: '123',
            name: 'Ilham B',
            role: 'admin'
        }
    ]);

    useEffect(() => {
        const callbackHandler = (user: User) => {
            setUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
        }

        socket.on("user-online", callbackHandler);

        return () => {
            socket.off("user-online", callbackHandler);
        }
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Stack spacing={2} sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
                Who's Online
                <Badge
                    badgeContent={users.length}
                    color="success"
                    sx={{ ml: 1.5 }}
                />
            </Typography>

            <AnimatePresence>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Stack direction={'row'} gap={2}>
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                variants={item}
                                layout
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                                <Tooltip title={`${user.name} is online`} arrow> 
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color="success">
                                        <Avatar
                                            src={user.photo}
                                            alt={user.name}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    </Badge>
                                </Tooltip>
                            </motion.div>
                        ))}
                    </Stack>
                </motion.div>
            </AnimatePresence>

            {users.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}>
                    <Typography variant="body2" color="text.secondary">
                        No users online currently
                    </Typography>
                </motion.div>
            )}
        </Stack>
    );
}