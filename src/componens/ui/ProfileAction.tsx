'use client'
import { Avatar, Box, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';


export default function ProfileAction() {
    
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
                    src={""}
                    alt={"Ilham B"}
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
