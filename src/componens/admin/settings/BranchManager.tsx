'use client'
import { db } from '@/firebase/config';
import {
    Box,
    Stack,
    Typography,
    Paper,
    Button,
    TextField,
    Collapse,
    IconButton,
} from '@mui/material';
import {
    collection,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import ClusterManager from './ClusterManager';
import { SettingsApplications } from '@mui/icons-material';

type Branch = {
    id: string;
    name: string;
    city: string;
    address: string;
};

export default function BranchManager() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const branchesRef = collection(db, 'branches');
        const unsub = onSnapshot(branchesRef, (snapshot) => {
            const data = snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Branch)
            );
            setBranches(data);
        });

        return () => unsub();
    }, []);

    const handleAdd = async () => {
        await addDoc(collection(db, 'branches'), {
            name: 'New Branch',
            city: '',
            address: '',
        });
    };

    const handleToggleExpand = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const handleUpdate = async (id: string, field: keyof Branch, value: string) => {
        const ref = doc(db, 'branches', id);
        await updateDoc(ref, { [field]: value });
    };

    return (
        <Stack spacing={2}>


            <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography fontSize={22} fontWeight={700}>
                    Branch Manager
                </Typography>
                <Button variant="contained" onClick={handleAdd}>
                    Add Branch
                </Button>
            </Stack>

            {branches.map((branch) => (
                <BranchItemComponent
                    key={branch.id}
                    branch={branch}
                    expanded={expandedId === branch.id}
                    onToggle={() => handleToggleExpand(branch.id)}
                    onUpdate={handleUpdate}
                />
            ))}
        </Stack>
    );
}

interface BranchItemProps {
    branch: Branch;
    expanded: boolean;
    onToggle: () => void;
    onUpdate: (id: string, field: keyof Branch, value: string) => void;
}

function BranchItemComponent({ branch, expanded, onToggle, onUpdate }: BranchItemProps) {
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        if (!expanded) setEdit(false);
    }, [expanded])
    return (
        <Box sx={{ p: 2, background: '#ffffff22', borderRadius: 2 }}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box onClick={onToggle} sx={{ cursor: 'pointer', flex: 1 }}>
                    <Typography fontWeight={600}>{branch.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {branch.city}
                    </Typography>
                </Box>
                {expanded && (
                    <IconButton onClick={() => setEdit(!edit)}>
                        <SettingsApplications />
                    </IconButton>
                )}
            </Stack>

            <Collapse in={expanded}>

                <Collapse in={edit}>
                    <Stack spacing={2} mt={2} p={2}>
                        <TextField
                            label="Name"
                            value={branch.name}
                            onChange={(e) => onUpdate(branch.id, 'name', e.target.value)}
                        />
                        <TextField
                            label="City"
                            value={branch.city}
                            onChange={(e) => onUpdate(branch.id, 'city', e.target.value)}
                        />
                        <TextField
                            label="Address"
                            value={branch.address}
                            onChange={(e) => onUpdate(branch.id, 'address', e.target.value)}
                        />
                    </Stack>
                </Collapse>

                <Box sx={{ mt: 3, p: 2, background: '#ffffff22', borderRadius: 1 }}>
                    <ClusterManager branchId={branch.id} />
                </Box>
            </Collapse>
        </Box>
    );
}
