'use client'
import { db } from '@/firebase/config';
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    Collapse,
    List,
    ListItem,
    Chip,
} from '@mui/material';
import {
    collection,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

type Cluster = {
    id: string;
    name: string;
    address: string;
    allocations: string[];
};

export default function ClusterManager({ branchId }: { branchId: string }) {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const clustersRef = collection(db, 'branches', branchId, 'clusters');
        const unsub = onSnapshot(clustersRef, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const clusterData = doc.data();
                return {
                    id: doc.id,
                    name: clusterData.name || '',
                    address: clusterData.address || '',
                    allocations: clusterData.allocations || [],
                } as Cluster;
            });
            setClusters(data);
        });

        return () => unsub();
    }, [branchId]);

    const handleAdd = async () => {
        await addDoc(collection(db, 'branches', branchId, 'clusters'), {
            name: 'New Cluster',
            address: '',
            allocations: [],
        });
    };

    const handleToggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleUpdate = async (
        id: string,
        field: keyof Cluster,
        value: string
    ) => {
        const ref = doc(db, 'branches', branchId, 'clusters', id);
        await updateDoc(ref, { [field]: value });
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={22} fontWeight={700}>
                    Clusters
                </Typography>
                <Button variant="contained" onClick={handleAdd}>
                    Add Cluster
                </Button>
            </Stack>

            <List>
                {clusters.map((cluster) => (
                    <ClusterItemComponent
                        key={cluster.id}
                        cluster={cluster}
                        expanded={expandedId === cluster.id}
                        onToggle={() => handleToggleExpand(cluster.id)}
                        onUpdate={handleUpdate}
                    />
                ))}
            </List>
        </Stack>
    );
}

interface ClusterItemProps {
    cluster: Cluster;
    expanded: boolean;
    onToggle: () => void;
    onUpdate: (id: string, field: keyof Cluster, value: string) => void;
}

function ClusterItemComponent({
    cluster,
    expanded,
    onToggle,
    onUpdate,
}: ClusterItemProps) {
    return (
        <ListItem
            sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                background: '#ffffff22',
                borderRadius: 1,
                mb: 1,
            }}
        >
            <Box onClick={onToggle} sx={{ cursor: 'pointer' }}>
                <Typography fontWeight={600}>{cluster.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {cluster.address}
                </Typography>
                {cluster.allocations?.length > 0 && (
                    <Typography variant="caption" color="primary">
                        {cluster.allocations.length} allocation(s)
                    </Typography>
                )}
            </Box>

            <Collapse in={expanded}>
                <Stack spacing={2} sx={{ mt: 2, mb: 1 }}>
                    <TextField
                        label="Name"
                        value={cluster.name}
                        onChange={(e) => onUpdate(cluster.id, 'name', e.target.value)}
                    />
                    <TextField
                        label="Address"
                        value={cluster.address}
                        onChange={(e) => onUpdate(cluster.id, 'address', e.target.value)}
                    />

                    <Stack spacing={1}>
                        <Typography fontWeight={500}>Allocations</Typography>

                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {cluster.allocations.map((tag, idx) => (
                                <Chip
                                    key={idx}
                                    label={tag}
                                    onDelete={() => {
                                        const updated = cluster.allocations.filter((_, i) => i !== idx);
                                        onUpdate(cluster.id, 'allocations', updated as any); // Firestore supports arrays
                                    }}
                                />
                            ))}
                        </Stack>

                        <TextField
                            placeholder="Add allocation and press Enter"
                            size="small"
                            onKeyDown={(e) => {
                                const input = (e.target as HTMLInputElement).value.trim();
                                if (e.key === 'Enter' && input) {
                                    e.preventDefault();
                                    const updated = [...cluster.allocations, input];
                                    onUpdate(cluster.id, 'allocations', updated as any);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }}
                        />
                    </Stack>
                </Stack>

            </Collapse>
        </ListItem>
    );
}
