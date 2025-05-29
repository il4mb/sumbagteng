"use client"

import { db } from '@/firebase/config';
import { RequestBase } from '@/types';
import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import UserAvatar from '../ui/UserAvatar';
import Link from 'next/link';

export interface MappedRequest extends Omit<RequestBase, "createdAt" | "updatedAt"> {
    type: "design" | "production";
    createdAt?: string;
    updatedAt?: string;
    timestamp?: number;
    createdBy: string;
}

const columns: GridColDef<MappedRequest>[] = [
    {
        field: "user",
        headerName: "User",
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const userId = params.row.createdBy;
            return (
                <UserAvatar userId={userId} size="small" />
            );
        }
    },
    { field: "id", headerName: "ID", width: 220 },
    { field: "type", headerName: "Type", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "description", headerName: "Description", width: 330 },
    { field: "createdAt", headerName: "Created At", width: 200 },
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
                    <Tooltip title="Confirm this request" arrow>
                        <Button
                            variant='contained'
                            size='small'
                            color='primary'
                            LinkComponent={Link}
                            href={"/dashboard/" + row.type + "s/confirm/" + row.id}>
                            Confirm
                        </Button>
                    </Tooltip>
                </Stack>
            );
        },
    },
];


export interface IPendingRequestProps {

}

export default function PendingRequest(props: IPendingRequestProps) {

    const [requests, setRequests] = useState<MappedRequest[]>([]);

    useEffect(() => {

        const formatDate = (ts: Timestamp | Date) => ts instanceof Timestamp ? ts.toDate().toLocaleString() : ts.toLocaleString();
        const unsubDesigns = onSnapshot(
            query(collection(db, "designs"), where("status", "==", "pending"), orderBy("createdAt", "desc")),
            (snapshot) => {
                const designRequests = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        createdBy: data.createdBy as string,
                        status: (data.status || "UNKNOWN").toUpperCase(),
                        description: data.description || "",
                        createdAt: data.createdAt ? formatDate(data.createdAt) : undefined,
                        updatedAt: data.updatedAt ? formatDate(data.updatedAt) : undefined,
                        timestamp: data.createdAt?.toMillis(),
                        type: "design" as const,
                    } as MappedRequest;
                });
                setRequests((prev) => {
                    const merged = [...prev, ...designRequests];
                    const sorted = merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    const uniqueRequests = Array.from(new Map(sorted.map(item => [item.id, item])).values());
                    return uniqueRequests;
                });
            }
        );
        const unsubProductions = onSnapshot(
            query(collection(db, "productions"), where("status", "==", "pending"), orderBy("createdAt", "desc")),
            (snapshot) => {
                const productionRequests = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: data.userId,
                        createdBy: data.createdBy as string,
                        status: (data.status || "UNKNOWN").toUpperCase(),
                        description: data.description || "",
                        createdAt: data.createdAt ? formatDate(data.createdAt) : undefined,
                        updatedAt: data.updatedAt ? formatDate(data.updatedAt) : undefined,
                        timestamp: data.createdAt?.toMillis(),
                        type: "production" as const,
                    } as MappedRequest;
                });
                setRequests((prev) => {
                    const merged = [...prev, ...productionRequests];
                    const sorted = merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    const uniqueRequests = Array.from(new Map(sorted.map(item => [item.id, item])).values());
                    return uniqueRequests;
                });
            }
        );

        return () => {
            unsubDesigns();
            unsubProductions();
        };
    }, []);

    return (
        <Box>
            <Typography fontSize={22} fontWeight={700}>PENDING</Typography>
            <Box sx={{ mt: 2 }}>
                {requests.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No pending requests at the moment.
                    </Typography>
                ) : (
                    <DataGrid
                        rows={requests}
                        columns={columns}
                        getRowClassName={(params) => `status-${params.row.status.toLocaleLowerCase()}`}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                            sorting: {
                                sortModel: [{ field: 'createdAt', sort: 'desc' }],
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                )}
            </Box>
        </Box>
    );
}
