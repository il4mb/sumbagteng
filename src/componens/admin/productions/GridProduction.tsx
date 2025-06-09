'use client'
import UserAvatar from '@/componens/ui/UserAvatar';
import { ProductionRequest } from '@/types';
import { Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ProductionViewDialog from './ui/ProductionViewDialog';
import { useListRequestForAdmin } from '@/componens/ctx/hooks';

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
        field: "branch",
        headerName: "Branch",
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
                    <ProductionViewDialog production={row} />
                </Stack>
            );
        },
    },
];

export interface IGridProductionProps {
    height?: number | string;
}

export default function GridProduction({ height = 600 }: IGridProductionProps) {
    const { loading, productions } = useListRequestForAdmin({ type: 'production' })

    return (
        <div style={{ height, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={productions}
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