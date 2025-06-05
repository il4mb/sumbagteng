"use client"

import { db } from "@/firebase/config";
import { DesignRequest, RequestStatus, User } from "@/types";
import { AspectRatio, Ballot, CalendarToday, Close, Description, ImageRounded, OpenInBrowserRounded, Style, Update } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Avatar,
    Stack,
    IconButton,
    CircularProgress,
    Box,
    Tooltip,
    alpha,
    Grid,
    Chip
} from "@mui/material";
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CompletionsDialog from "../CompletionsDialog";

export interface IViewDetailActionProps {
    designId: string;
}

export default function ViewDetailAction(props: IViewDetailActionProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Tooltip title="View Detail" arrow>
                <IconButton onClick={() => setOpen(true)}>
                    <OpenInBrowserRounded />
                </IconButton>
            </Tooltip >
            {open && (
                <DetailDesignDialog id={props.designId} onClose={() => setOpen(false)} open />
            )}
        </>
    );
}



type RawDesignRequest = Omit<DesignRequest, "createdAt" | "updatedAt"> & {
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

type Props = {
    id: string;
    open: boolean;
    onClose: () => void;
}
const getColor = (status?: RequestStatus) =>
    status == "finished" ? "primary"
        : status == "accepted" ? "success"
            : status == "pending" ? "warning"
                : "secondary"

const DetailDesignDialog = ({ id, open, onClose }: Props) => {
    const [createdBy, setCreatedBy] = useState<User | null>(null);
    const [design, setDesign] = useState<DesignRequest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !open) return;

        setLoading(true);
        const docRef = doc(db, "designs", id);
        const unsub = onSnapshot(docRef, async (snap) => {
            try {
                const data = { id: snap.id, ...snap.data() } as RawDesignRequest;

                const userSnap = await getDoc(doc(db, "users", data.createdBy));
                const user = userSnap.data() as User;

                setCreatedBy(user);
                setDesign({
                    ...data,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt?.toDate() || undefined
                });
            } catch (error) {
                console.error("Error fetching design details:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, [id, open]);

    const formatDate = (date?: Date) => {
        if (!date) return "NaN";
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{ paper: { sx: { maxWidth: 680 } } }}
            fullWidth>
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.contrastText,
                py: 1,
                px: 3,
                mb: 3
            }}>
                <Typography variant="h6">Design Request Details</Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'inherit' }}
                    component={motion.div}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : design ? (
                    <Stack spacing={3}>
                        {/* Header Section */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={createdBy?.photo}
                                sx={{ width: 56, height: 56 }}
                            />
                            <Stack>
                                <Typography variant="h6">{createdBy?.name || 'Unknown User'}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                    {createdBy?.role}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Details Section */}
                        <Stack spacing={2}>

                            <Typography fontSize={22} fontWeight={700}>
                                {design.name || "No name"}
                                <Chip label={design?.status} color={getColor(design?.status)} sx={{ textTransform: "capitalize", ml: 2 }} />
                            </Typography>

                            <Grid container>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Style color="action" />
                                        <Typography>
                                            <strong>Theme:</strong> {design.theme}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <CalendarToday color="action" />
                                        <Typography>
                                            <strong>Created:</strong> {formatDate(design.createdAt)}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <AspectRatio color="action" />
                                        <Typography>
                                            <strong>Size:</strong> {design.size}
                                        </Typography>
                                    </Stack>

                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Update color="action" />
                                        <Typography>
                                            <strong>Last Updated:</strong> {formatDate(design.updatedAt)}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Ballot color="action" />
                                        <Typography>
                                            <strong>Type:</strong> {design.type}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Description color="action" sx={{ mt: 1 }} />
                                <Stack>
                                    <Typography gutterBottom><strong>Description:</strong></Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            backgroundColor: (theme) => alpha(theme.palette.grey[100], 0.2),
                                            p: 2,
                                            borderRadius: 1
                                        }}>
                                        {design.description || 'No description provided'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Box>
                            <Typography fontWeight={700} gutterBottom>Design Reference:</Typography>
                            <AnimatePresence>
                                <Stack direction={'row'} spacing={2} sx={{ overflow: 'auto' }}>
                                    {design.images && (
                                        design.images.map((img, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}>
                                                <Avatar
                                                    variant="rounded"
                                                    src={img.startsWith("http") ? img : `/storage/${img}`}
                                                    sx={{ width: 200, height: 200 }} >
                                                    <ImageRounded />
                                                </Avatar>

                                            </motion.div>
                                        ))
                                    )}
                                </Stack>
                            </AnimatePresence>
                        </Box>
                    </Stack>
                ) : (
                    <Typography variant="body1" textAlign="center" py={4}>
                        No design data found
                    </Typography>
                )}

            </DialogContent>
            {design && (
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="secondary"
                        component={motion.div}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        Close
                    </Button>
                    <CompletionsDialog text="Completion List" designId={design?.id} />
                </DialogActions>
            )}
        </Dialog>
    );
};