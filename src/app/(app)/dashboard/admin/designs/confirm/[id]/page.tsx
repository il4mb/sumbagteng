"use server";

import { adminDb } from '@/firebase/config-admin';
import { getSession, UserInfo } from '@/lib/session';
import { DesignRequest } from '@/types';
import { Button, Typography, Box, Stack } from '@mui/material';
import Link from 'next/link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DesignServicesIcon from '@mui/icons-material/DesignServices';

export interface IConfirmDesignProps {
    params: Promise<{ id: string }>;
}

export default async function ConfirmDesign({ params }: IConfirmDesignProps) {
    const { id } = await params;
    const user: UserInfo | null = await getSession();

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Session Expired
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Please log in again to continue
                </Typography>
                <Button
                    variant="contained"
                    LinkComponent={Link}
                    href="/login"
                    startIcon={<PersonOutlineIcon />}>
                    Login
                </Button>
            </Box>
        );
    }

    const designRef = adminDb.doc(`designs/${id}`);
    const designSnap = await designRef.get();

    if (!designSnap.exists) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Design Not Found
                </Typography>
                <Typography variant="body1">
                    The requested design could not be found
                </Typography>
            </Box>
        );
    }

    const design = designSnap.data() as DesignRequest;

    if (design.executorId && design.executorId !== user.uid) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <ErrorOutlineIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Design Already Taken
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    This design has already been assigned to another executor
                </Typography>
                <Button
                    variant="outlined"
                    LinkComponent={Link}
                    href="/dashboard"
                    startIcon={<DesignServicesIcon />}>
                    View Other Designs
                </Button>
            </Box>
        );
    }

    if (!design.executorId || design.status == "pending") {
        await designRef.update({
            executorId: user.uid,
            status: 'confirmed'
        });
    }

    return (
        <Box sx={{ minHeight: '90vh', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center', p: 4, mt: 4 }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" gutterBottom color="success.main">
                    Design Confirmed!
                </Typography>

                <Stack spacing={1} sx={{ maxWidth: 400, mx: 'auto', my: 3, textAlign: 'left' }}>
                    <Typography variant="body1">
                        <strong>Design ID:</strong> {id}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Confirmed by:</strong> {user.uid}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Status:</strong> Confirmed
                    </Typography>
                </Stack>

                <Button
                    variant="contained"
                    LinkComponent={Link}
                    href={`/dashboard/design/${id}`}
                    sx={{ mt: 3 }}
                    startIcon={<DesignServicesIcon />}>
                    Go To Design
                </Button>
            </Box>
        </Box>
    );
}