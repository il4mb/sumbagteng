'use client'
import { useAuth } from '@/componens/AuthProvider';
import UserAvatar from '@/componens/ui/UserAvatar';
import { db } from '@/firebase/config';
import { Message, MessageRounded, OpenInBrowserRounded, Refresh, TaskAltRounded } from '@mui/icons-material';
import { Button, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import DrafCompletionDialog from './actions/DrafCompletionDialog';
import { green } from '@mui/material/colors';
import ViewDetailAction from './actions/ViewDetailAction';
import ChatButton from '@/componens/chats/ChatButton';

type MappedRequest = {
    id: string;
    createdBy: string;
    status: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
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
        field: "status",
        headerName: "Status",
        width: 130,
        valueFormatter: (value: string) => value.toString().toUpperCase() || 'UNKNOWN'
    },
    { field: "description", headerName: "Description", width: 330 },
    {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        valueFormatter: (value) => value || 'N/A'
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        width: 200,
        valueFormatter: (value) => value || 'N/A'
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 280,
        sortable: false,
        filterable: false,
        renderHeader: () => null,
        renderCell: (params) => {
            const row = params.row;
            return (
                <Stack direction="row" spacing={1} alignItems={'center'} mt={1.4}>
                    <>
                        <ViewDetailAction designId={row.id} />
                        <ChatButton designId={row.id} />
                    </>
                </Stack>
            );
        },
    },
];

export interface IGridDesignProps {
    height?: number | string;
}

export default function GridDesign({ height = 600 }: IGridDesignProps) {
    const { user } = useAuth();
    const [designs, setDesigns] = useState<MappedRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);

    const fetchDesigns = useCallback(() => {
        if (!user?.uid) {
            setDesigns([]);
            setLoading(false);
            return () => { };
        }

        setLoading(true);
        const formatDate = (ts: Timestamp | Date) =>
            ts instanceof Timestamp ? ts.toDate().toLocaleString() : ts.toLocaleString();

        const unsubDesigns = onSnapshot(
            query(
                collection(db, "designs"),
                where("executedBy", "==", user.uid),
                orderBy("createdAt", "desc")
            ),
            (snapshot) => {
                const designRequests = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        createdBy: data.createdBy as string,
                        status: data.status || "pending",
                        description: data.description || "",
                        createdAt: data.createdAt ? formatDate(data.createdAt) : undefined,
                        updatedAt: data.updatedAt ? formatDate(data.updatedAt) : undefined,
                        timestamp: data.createdAt?.toMillis(),
                    };
                });

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
    }, [user?.uid]);

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