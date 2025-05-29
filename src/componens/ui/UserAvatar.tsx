"use client"
import { db } from '@/firebase/config';
import { User } from '@/types';
import { QuestionMarkRounded } from '@mui/icons-material';
import { Avatar, Box } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface IUserAvatarProps {
    user?: User;
    userId?: string;
    size?: "small" | "medium" | "large";
}

export default function UserAvatar(props: IUserAvatarProps) {
    const { userId, size = "medium" } = props;
    const [user, setUser] = useState<User | null>(props.user || null);
    const [loading, setLoading] = useState(!props.user && !!userId);

    useEffect(() => {
        if (!userId) return;

        const getUserData = async () => {
            setLoading(true);
            const userRef = doc(db, "users", userId);
            const d = await getDoc(userRef);
            if (d.exists()) {
                setUser({ id: d.id, ...d.data() } as User);
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        getUserData();
    }, [userId]);


    return (
        <Box sx={{ textAlign: 'center', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            {user ? (

                <Avatar
                    src={user.photo || undefined}
                    alt={user.name || "User Avatar"}
                    sx={{
                        width: size === "small" ? 30 : size === "medium" ? 38 : 48,
                        height: size === "small" ? 30 : size === "medium" ? 38 : 48,
                        fontSize: size === "small" ? 14 : size === "medium" ? 16 : 20,
                        bgcolor: user.photo ? undefined : "primary.main"
                    }}>
                    {!user.photo && user.name?.[0]?.toUpperCase()}
                </Avatar>

            ) : (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    p: 1,
                    width: size === "small"
                        ? 30 : size === "medium"
                            ? 38 : 48,
                    height: size === "small"
                        ? 30 : size === "medium"
                            ? 38 : 48, borderRadius: '50%'
                }}>
                    <QuestionMarkRounded sx={{
                        width: size === "small" ? 25 : size === "medium" ? 30 : 40,
                        height: size === "small" ? 25 : size === "medium" ? 30 : 40,
                        fontSize: size === "small" ? 14 : size === "medium" ? 16 : 20,
                        color: "text.disabled"
                    }} />
                </Box>
            )}
        </Box>
    );
}
