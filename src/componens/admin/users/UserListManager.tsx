'use client'

import React, { useEffect, useState } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent,
    TextField, DialogActions, Box,
    MenuItem, Select, FormControl, InputLabel, Alert
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Add, DeleteRounded, EditRounded } from '@mui/icons-material';
import { User as IUser } from '@/types';
import { AddUser, ListUser, UpdateUser, DeleteUser } from '@/action/users';
import { useSnackbar } from 'notistack';
import { UsersGridToolbar } from './ui/UsersGridToolbar';
import { useAuth } from '@/componens/AuthProvider';

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        add: () => void;
    }
}

type User = IUser & {
    email: string;
    isNew?: boolean;
}

type FormType = {
    password: string | null;
    name: string;
    email: string;
    role: "admin" | "client"
}

export default function UserListManager() {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null); // Added this line
    const [form, setForm] = useState<FormType>({ name: '', email: '', role: 'client', password: null });
    const [password, setPassword] = useState('');

    const fetchUsers = async () => {
        ListUser().then(api => {
            if (api.status) {
                setUsers((api.data as User[]).map(e => ({ ...e, isNew: false })))
            } else {
                throw new Error(api.message)
            }
        }).catch(error => {
            enqueueSnackbar(error.message || "Caught an Error", { variant: 'error' })
        })
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleOpenAddDialog = () => {
        setForm({ name: '', email: '', role: 'client', password: null });
        setPassword('');
        setOpenAddDialog(true);
    };

    const handleOpenEditDialog = (user: User) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, role: user.role, password: null });
        setOpenEditDialog(true);
    };

    const handleOpenDeleteDialog = (id: string) => {
        setCurrentUserId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenEditDialog(false);
        setOpenAddDialog(false);
        setOpenDeleteDialog(false);
        setCurrentUserId(null);
        setEditingUser(null);
    };

    const handleSave = async () => {
        try {
            if (editingUser) {
                const res = await UpdateUser({
                    id: editingUser.id,
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    password: form.password
                });
                if (!res.status) throw new Error(res.message);
                enqueueSnackbar("User updated successfully", { variant: 'success' });
                handleCloseDialog();
                fetchUsers();
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || "Failed to update user", { variant: 'error' });
        }
    };

    const handleAdd = async () => {
        try {
            if (!password) {
                enqueueSnackbar("Password is required", { variant: 'warning' });
                return;
            }

            const res = await AddUser({
                name: form.name,
                email: form.email,
                password,
                role: form.role,
                photo: ''
            });

            if (!res.status) throw new Error(res.message);
            enqueueSnackbar("User added successfully", { variant: 'success' });
            handleCloseDialog();
            fetchUsers();
        } catch (err: any) {
            enqueueSnackbar(err.message || "Failed to add user", { variant: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            if (!currentUserId) return;

            const res = await DeleteUser(currentUserId);
            if (!res.status) throw new Error(res.message);

            enqueueSnackbar("User deleted successfully", { variant: 'success' });
            handleCloseDialog();
            fetchUsers();
        } catch (err: any) {
            enqueueSnackbar(err.message || "Failed to delete user", { variant: 'error' });
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        const user = users.find(u => u.id === id);
        if (user) {
            handleOpenEditDialog(user);
        }
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        handleOpenDeleteDialog(id.toString());
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'role',
            headerName: "Role",
            flex: 1,
            valueFormatter: (value: string) => value.toUpperCase()
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditRounded />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                        style={{ display: user?.id == id ? "none" : "block" }}
                    />,
                ];
            },
        },
    ];

    return (
        <Box p={2}>
            <Box mt={2} style={{ height: 400 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    slots={{ toolbar: UsersGridToolbar }}
                    slotProps={{
                        toolbar: {
                            add: handleOpenAddDialog
                        },
                    }}
                    showToolbar
                />
            </Box>

            {/* Edit User Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={form.role}
                                label="Role"
                                onChange={(e) => setForm({ ...form, role: e.target.value as FormType['role'] })}>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="client">Client</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="New Password"
                            fullWidth
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            margin="normal"
                            helperText="Leave it blank to not change the password"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={openAddDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={form.role}
                                label="Role"
                                onChange={(e) => setForm({ ...form, role: e.target.value as FormType['role'] })}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="client">Client</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAdd} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Alert severity="warning">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}