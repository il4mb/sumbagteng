'use client';

import {
    Box,
    Button,
    Collapse,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { db } from '@/firebase/config';
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialogButton from '@/componens/ui/ConfirmDialogButton';

type Theme = {
    id: string;
    name: string;
};

export default function ThemeManager() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const ref = collection(db, 'themes');
        const unsub = onSnapshot(ref, (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Theme));
            setThemes(data);
        });
        return () => unsub();
    }, []);

    const handleAdd = async () => {
        await addDoc(collection(db, 'themes'), { name: 'New Theme' });
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'themes', id));
    };

    const handleUpdate = async (id: string, value: string) => {
        await updateDoc(doc(db, 'themes', id), { name: value });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={22} fontWeight={700}>Themes</Typography>
                <Button onClick={handleAdd} variant="contained">Add</Button>
            </Stack>

            <List>
                {themes.map((t) => (
                    <ListItem
                        key={t.id}
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            background: '#ffffff22',
                            borderRadius: 1,
                            mb: 1,
                        }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                            <Box onClick={() => toggleExpand(t.id)} sx={{ cursor: 'pointer' }}>
                                <Typography fontWeight={600}>{t.name}</Typography>
                            </Box>

                            <ConfirmDialogButton
                                title='Are you sure?'
                                message="This will permanently delete the theme and its sub-data."
                                variant='error'
                                onConfirm={() => handleDelete(t.id)}
                                slotProps={{
                                    button: {
                                        sx: { minWidth: 0, width: 40 },
                                        children: <DeleteIcon />
                                    }
                                }}
                            />
                        </Stack>

                        <Collapse in={expandedId === t.id}>
                            <Stack spacing={1} mt={2}>
                                <TextField
                                    label="Theme Name"
                                    value={t.name}
                                    onChange={(e) => handleUpdate(t.id, e.target.value)}
                                />
                            </Stack>
                        </Collapse>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
