'use client';
import { db } from "@/firebase/config";
import { RequestBase } from "@/types";
import { Box, CircularProgress, Stack } from "@mui/material";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../AuthProvider";
import RequestViewDialogButton from "./RequestViewDialogButton";
import ChatButton from "../chats/ChatButton";

export interface MappedRequest extends Omit<RequestBase, "createdAt" | "updatedAt"> {
    type: "design" | "production";
    createdAt?: string;
    updatedAt?: string;
    timestamp?: number; // Added for sorting
}

const columns: GridColDef<MappedRequest>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "type", headerName: "Type", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
    {
        field: "actions",
        headerName: "",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const row = params.row;
            return (
                <Stack direction="row" spacing={1} alignItems={'center'} mt={0.5}>
                    <RequestViewDialogButton row={row} />
                    {row.type == "design" && ["CONFIRMED"].includes(row.status) && (
                        <ChatButton row={row} />
                    )}
                </Stack>
            );
        },
    },
];

export default function RequestGrid() {
    const [requests, setRequests] = useState<MappedRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.uid) return;

        const formatDate = (ts: Timestamp | Date) => ts instanceof Timestamp ? ts.toDate().toLocaleString() : ts.toLocaleString();

        const unsubDesigns = onSnapshot(
            query(
                collection(db, "designs"),
                where("createdBy", "==", user.uid),
                orderBy("createdAt", "desc")
            ),
            (snapshot) => {
                const designRequests = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: data.userId,
                        status: (data.status || "UNKNOWN").toUpperCase(),
                        description: data.description || "",
                        createdAt: data.createdAt ? formatDate(data.createdAt) : undefined,
                        updatedAt: data.updatedAt ? formatDate(data.updatedAt) : undefined,
                        timestamp: data.createdAt?.toMillis(), // Convert to milliseconds for client-side sorting
                        type: "design" as const,
                    };
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
            query(
                collection(db, "productions"),
                where("createdBy", "==", user.uid),
                orderBy("createdAt", "desc")
            ),
            (snapshot) => {
                const productionRequests = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        userId: data.userId,
                        status: (data.status || "UNKNOWN").toUpperCase(),
                        description: data.description || "",
                        createdAt: data.createdAt ? formatDate(data.createdAt) : undefined,
                        updatedAt: data.updatedAt ? formatDate(data.updatedAt) : undefined,
                        timestamp: data.createdAt?.toMillis(), // Convert to milliseconds for client-side sorting
                        type: "production" as const,
                    };
                });
                setRequests((prev) => {
                    const merged = [...prev, ...productionRequests];
                    const sorted = merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    const uniqueRequests = Array.from(new Map(sorted.map(item => [item.id, item])).values());
                    return uniqueRequests;
                });
            }
        );

        setLoading(false);

        return () => {
            unsubDesigns();
            unsubProductions();
        };
    }, [user?.uid]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            height: 600,
            width: "100%",
            '& .status-approved': { backgroundColor: '#00ff4833' },
            '& .status-rejected': { backgroundColor: '#ff000033' },
            '& .status-in-progress': { backgroundColor: '#0066ff33' },
            '& .status-completed': { backgroundColor: '#00ff0033' },
            '& .status-revision': { backgroundColor: '#ff990033' },
            '& .status-pending': { backgroundColor: '#f0f0f033' }
        }}>
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
        </Box>
    );
}