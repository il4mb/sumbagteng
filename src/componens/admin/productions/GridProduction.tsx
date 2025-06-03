'use client'
import { useAuth } from '@/componens/AuthProvider';
import UserAvatar from '@/componens/ui/UserAvatar';
import { db } from '@/firebase/config';
import { ProductionRequest } from '@/types';
import { Refresh } from '@mui/icons-material';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import ProductionViewDialog from './ui/ProductionViewDialog';

type MappedRequest = ProductionRequest & {
    timestamp?: number;
};

const columns: GridColDef<MappedRequest>[] = [
    {
        field: "user",
        headerName: "User",
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const userId = params.row.createdBy;
            return <UserAvatar userId={userId} size="small" />;
        }
    },
    { field: "id", headerName: "ID", width: 220 },
    {
        field: "location",
        headerName: "Location",
        width: 120
    },
    { field: "cluster", headerName: "Cluster", width: 220 },
    {
        field: "allocation",
        headerName: "Allocation",
        width: 120,
    },
    {
        field: "quantity",
        headerName: "Quantity",
        width: 100,
    },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 280,
        valueFormatter: (value: Date) => {
            return value.toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        }

    },
    {
        field: "actions",
        headerName: "",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const row = params.row;
            return (
                <Stack direction="row" spacing={1} alignItems={'center'} mt={1.4}>
                    <ProductionViewDialog productionId={row.id} />
                </Stack>
            );
        },
    },
];

export interface IGridProductionProps {
    height?: number | string;
}

export default function GridProduction({ height = 600 }: IGridProductionProps) {
    const { user } = useAuth();
    const [designs, setDesigns] = useState<MappedRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);

    const fetchDesigns = useCallback(() => {
        if (!user?.id) {
            setDesigns([]);
            setLoading(false);
            return () => { };
        }

        setLoading(true);
        const formatDate = (ts?: Timestamp) => !ts ? undefined : ts.toDate();

        const unsubDesigns = onSnapshot(
            query(
                collection(db, "productions"),
                where("executedBy", "==", user.id),
                orderBy("createdAt", "desc")
            ),
            async (snapshot) => {
                const designRequestsPromise = snapshot.docs.map(async (docRef) => {

                    const data = docRef.data() as Omit<ProductionRequest, "createdAt" | "updatedAt"> & { createdAt: Timestamp; updatedAt: Timestamp };
                    const locationRef = doc(db, "locations", data.location);
                    const locationSnap = await getDoc(locationRef);
                    const location = locationSnap.data() as { city: string; }

                    const clusterRef = doc(locationRef, "clusters", data.cluster);
                    const clusterSnap = await getDoc(clusterRef);
                    const cluster = clusterSnap.data() as { name: string; }

                    return {
                        ...data,
                        id: docRef.id,
                        status: data.status || "pending",
                        createdBy: data.createdBy as string,
                        createdAt: formatDate(data.createdAt),
                        updatedAt: formatDate(data.updatedAt),
                        timestamp: data.createdAt?.toMillis(),
                        location: location.city,
                        cluster: cluster.name
                    };
                });

                const designRequests = await Promise.all(designRequestsPromise);

                // @ts-ignore
                setDesigns(prev => {
                    const merged = [...prev, ...designRequests];
                    const sorted = merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    return Array.from(new Map(sorted.map(item => [item.id, item])).values());
                });
                setLoading(false);
                setHasInitialLoad(true);
            },
            (error) => {
                console.error("Error fetching designs:", error);
                setLoading(false);
                setHasInitialLoad(true);
            }
        );

        return unsubDesigns;
    }, [user?.id]);

    useEffect(() => {
        const unsubscribe = fetchDesigns();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [fetchDesigns]);

    const handleReload = useCallback(() => {
        setHasInitialLoad(false);
        fetchDesigns();
    }, [fetchDesigns]);

    if (!hasInitialLoad && loading) {
        return (
            <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading designs...
            </div>
        );
    }

    if (hasInitialLoad && designs.length === 0) {
        return (
            <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                No design requests found
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleReload}>
                    Refresh
                </Button>
            </div>
        );
    }

    return (
        <div style={{ height, width: '100%', position: 'relative' }}>
            <Tooltip title="Reload" arrow>
                <IconButton
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 8,
                        zIndex: 1
                    }}
                    onClick={handleReload}
                    disabled={loading}>
                    <Refresh />
                </IconButton>
            </Tooltip>

            <DataGrid
                rows={designs}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                    },
                }}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                    },
                }}
            />
        </div>
    );
}