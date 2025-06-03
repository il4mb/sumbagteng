"use client"
import { db } from '@/firebase/config';
import socket from '@/socket';
import { User } from '@/types';
import { Avatar, Badge, Stack, Tooltip, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WhoseOnline() {
    const [uids, setUids] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const callbackHandler = (uids: string[]) => setUids(uids);
        socket.on("online-users", callbackHandler);
        socket.emit("seek-online-users");
        return () => {
            socket.off("online-users", callbackHandler);
        }
    }, []);

    useEffect(() => {

        if (uids.length === 0) {
            setUsers([]);
            return;
        }

        async function fetchUsers() {
            try {
                // Map over uids and fetch user doc for each uid
                const userPromises = uids.map(async (uid) => {
                    const docRef = doc(db, 'users', uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        return { id: uid, ...docSnap.data() } as User;
                    } else {
                        return null;
                    }
                });

                const usersData = await Promise.all(userPromises);
                // Filter out any nulls (non-existent users)
                setUsers(usersData.filter(Boolean) as User[]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUsers();
    }, [uids]);


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
                                            src={user.photo?.startsWith('http') ? user.photo : '/storage/' + user.photo}
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