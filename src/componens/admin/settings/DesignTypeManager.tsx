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
    IconButton,
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

type DesignType = {
    id: string;
    name: string;
};

type Size = {
    id: string;
    name: string;
    value: string;
};

export default function DesignTypeManager() {
    const [designTypes, setDesignTypes] = useState<DesignType[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const ref = collection(db, 'design-types');
        const unsub = onSnapshot(ref, (snap) => {
            const data = snap.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as DesignType)
            );
            setDesignTypes(data);
        });
        return () => unsub();
    }, []);

    const handleAdd = async () => {
        await addDoc(collection(db, 'design-types'), { name: 'New Design' });
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'design-types', id));
    };

    const handleUpdate = async (id: string, value: string) => {
        await updateDoc(doc(db, 'design-types', id), { name: value });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={22} fontWeight={700}>Design Types</Typography>
                <Button onClick={handleAdd} variant="contained">Add</Button>
            </Stack>

            <List>
                {designTypes.map((d) => (
                    <ListItem
                        key={d.id}
                        sx={{ flexDirection: 'column', alignItems: 'stretch', background: '#ffffff22', borderRadius: 1, mb: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                            <Box onClick={() => toggleExpand(d.id)} sx={{ cursor: 'pointer' }}>
                                <Typography fontWeight={600}>{d.name}</Typography>
                            </Box>

                            <ConfirmDialogButton
                                title='Are you sure?'
                                message="Are you sure to delete this Design Type?, this action cannot undone."
                                variant='error'
                                onConfirm={() => handleDelete(d.id)}
                                slotProps={{
                                    button: {
                                        sx: { minWidth: 0, width: 40 },
                                        children: (
                                            <>
                                                <DeleteIcon />
                                            </>
                                        )
                                    }
                                }} />
                        </Stack>

                        <Collapse in={expandedId === d.id}>
                            <Stack spacing={1} mt={2}>
                                <TextField
                                    label="Design Type Name"
                                    value={d.name}
                                    onChange={(e) => handleUpdate(d.id, e.target.value)}
                                />
                                <SizeManager designTypeId={d.id} />
                            </Stack>
                        </Collapse>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

function SizeManager({ designTypeId }: { designTypeId: string }) {
    const [sizes, setSizes] = useState<Size[]>([]);

    useEffect(() => {
        const ref = collection(db, 'design-types', designTypeId, 'sizes');
        const unsub = onSnapshot(ref, (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Size));
            setSizes(data);
        });
        return () => unsub();
    }, [designTypeId]);

    const addSize = async () => {
        await addDoc(collection(db, 'design-types', designTypeId, 'sizes'), {
            name: 'Size',
            value: ''
        });
    };

    const updateSize = async (id: string, field: keyof Size, value: string) => {
        await updateDoc(doc(db, 'design-types', designTypeId, 'sizes', id), {
            [field]: value
        });
    };

    const deleteSize = async (id: string) => {
        await deleteDoc(doc(db, 'design-types', designTypeId, 'sizes', id));
    };

    return (
        <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>Sizes</Typography>
                <Button size="small" onClick={addSize}>Add Size</Button>
            </Stack>

            {sizes.map(size => (
                <Stack key={size.id} direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        label="Name"
                        value={size.name}
                        onChange={(e) => updateSize(size.id, 'name', e.target.value)}
                    />
                    <TextField
                        size="small"
                        label="Value"
                        value={size.value}
                        onChange={(e) => updateSize(size.id, 'value', e.target.value)}
                    />
                    <IconButton onClick={() => deleteSize(size.id)}><DeleteIcon /></IconButton>
                </Stack>
            ))}
        </Stack>
    );
}
