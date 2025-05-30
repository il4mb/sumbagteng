"use client";

import { db } from "@/firebase/config";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export interface IConfirmCompletionDialogProps {
    id: string;
    completionId: string;
}

export default function ConfirmCompletionDialog({ id, completionId }: IConfirmCompletionDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const designRef = doc(db, "designs", id);
            const completionRef = doc(designRef, "completions", completionId);
            await updateDoc(completionRef, {
                status: 'accepted',
                updatedAt: new Date()
            });
            await updateDoc(designRef, {
                status: "finished",
                finishedAt: new Date()
            });

            handleClose();
        } catch (err) {
            console.error("Confirmation failed:", err);
            setError("Failed to confirm completion. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleOpen} variant="contained" color="success">
                Confirm Design
            </Button>
            <Dialog onClose={handleClose} open={open} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Completion</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Typography>
                        Are you sure you want to confirm this design as completed?
                        This action is final and cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        variant="contained"
                        color="success">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
