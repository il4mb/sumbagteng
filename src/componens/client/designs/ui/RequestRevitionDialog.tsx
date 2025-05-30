"use client";

import { db } from "@/firebase/config";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export interface IRequestRevisionDialogProps {
    id: string;
    completionId: string;
}

export default function RequestRevisionDialog({ id, completionId }: IRequestRevisionDialogProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [completionsCount, setCompletionsCount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    useEffect(() => {
        if (!open || !id) return;

        const fetchCompletions = async () => {
            try {
                const collRef = collection(db, "designs", id, "completions");
                const snap = await getDocs(collRef);
                setCompletionsCount(snap.size);
            } catch (error) {
                enqueueSnackbar("Failed to fetch completions", { variant: "error" });
            }
        };

        fetchCompletions();
    }, [id, open, enqueueSnackbar]);

    const handleRequestRevision = async () => {
        if (completionsCount >= 4 || !message.trim()) return;

        setLoading(true);
        try {

            console.log( "designs", id, "completions", completionId)

            const docRef = doc(db, "designs", id, "completions", completionId);
            await updateDoc(docRef, {
                status: 'rejected',
                rejectMessage: message.trim(),
                rejectedAt: new Date()
            });
            enqueueSnackbar("Revision request submitted", { variant: "success" });
            handleClose();
        } catch (err) {
            console.error("Revision request failed:", err);
            enqueueSnackbar("Failed to submit revision", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const remaining = 4 - completionsCount;

    return (
        <>
            <Button onClick={handleOpen}>Request Revision</Button>
            <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
                <DialogTitle>Request Revision</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    {completionsCount >= 4 ? (
                        <Alert severity="error">
                            You've reached the maximum revision requests (3 allowed).
                        </Alert>
                    ) : (
                        <>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography fontWeight={600}>
                                    Revision limit: 3 times
                                </Typography>
                                <Typography>
                                    You’ve requested {completionsCount - 1} revisions. {remaining} remaining.
                                </Typography>
                            </Alert>
                            <Typography variant="body2" mb={1}>
                                Describe the issue or changes you’d like for this design:
                            </Typography>
                            <TextField
                                autoFocus
                                label="Revision message"
                                multiline
                                rows={4}
                                fullWidth
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button
                        onClick={handleRequestRevision}
                        disabled={completionsCount >= 4 || loading || !message.trim()}
                        variant="contained"
                        color="warning">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
