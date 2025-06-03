'use client'
import { User } from '@/types';
import { Avatar, Box, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { MouseEvent, useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';


export default function ProfileAction() {
    const { user} = useAuth();
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchor);

    const handleOpen = (e: MouseEvent<HTMLDivElement>) => {
        setAnchor(e.currentTarget);
    }

    const handleClose = () => {
        setAnchor(null);
    }

    return (
        <>
            <Box component={"div"} sx={{ position: 'relative' }} onClick={handleOpen}>
                <Avatar
                    src={user?.photo?.startsWith('http') ? user?.photo : '/storage/' + user?.photo}
                    alt={user?.name}
                    sx={{ width: 40, height: 40 }}

                />
            </Box>
            <Menu
                anchorEl={anchor}
                onClose={handleClose}
                open={open}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 120,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2
                        }
                    }
                }}>
                <MenuItem onClick={handleClose} component={Link} href="/dashboard/profile">
                    Profile
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        fetch('/api/auth', { method: 'DELETE' })
                            .then(() => {
                                window.location.href = '/login';
                            })
                            .catch(err => console.error('Logout failed:', err));
                    }}>
                    Keluar
                </MenuItem>
            </Menu>
        </>
    );
}
