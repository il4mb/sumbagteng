'use client';

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from './AuthProvider';
import { useSnackbar } from 'notistack';
import { UpdateUser } from '@/action/users';

export default function ProfileManager() {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<(typeof user) & { password: string | null }>({ ...user, password: '' } as any);
    const [form, setForm] = useState<Omit<typeof profile, "photo"> & { photo: File | null, [key: string]: any }>({ ...profile, photo: null, updatedAt: null });

    useEffect(() => {
        if (user) {
            setProfile({ ...user, password: '' });
            setForm({ ...user, password: '', photo: null, id: user.id });
        }
    }, [user]);
    const handleChange = (field: string, value: string | File) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfile(prev => ({ ...prev, photo: event.target?.result as string }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
            handleChange("photo", e.target.files[0] || null);
        }
    };

    const handleSave = async () => {
        const response = await UpdateUser({ ...form, email: undefined });
        if (response.status) {
            enqueueSnackbar("Update profile successful", { variant: 'success' });
            setEditing(false);
        } else {
            enqueueSnackbar(response.message || "Failed update profile", { variant: 'error' })
        }
    };

    const getPhotoUrl = () => {
        const photo = profile.photo || '';
        return photo.startsWith("http") || photo.startsWith('data:image') ? photo : '/storage/' + photo;
    }

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={2} alignItems="center">
                    <Avatar
                        src={getPhotoUrl()}
                        alt={profile.name}
                        sx={{ width: 120, height: 120 }}
                    />
                    {editing && (
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => fileInputRef.current?.click()}>
                                Change Photo
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </>
                    )}
                    {!editing && (
                        <Typography variant="h6">{profile.name}</Typography>
                    )}
                </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                    {editing ? (
                        <>
                            <TextField
                                label="Name"
                                value={profile.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={profile.email}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    }
                                }}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={profile.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                fullWidth
                                helperText="Leave blank to keep current password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle1">
                                <strong>Name:</strong> {profile.name}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Email:</strong> {profile.email}
                            </Typography>
                        </>
                    )}

                    <Divider />

                    <Box display="flex" gap={2}>
                        {editing ? (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        setEditing(false);
                                        // Reset password field when canceling
                                        setProfile(prev => ({ ...prev, password: '' }));
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    );
}