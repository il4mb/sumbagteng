'use client'

import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

export interface IConfirmDialogProps {
    onConfirm?: () => void;
    onCancel?: () => void;
    title?: string;
    message?: string | React.ReactNode;
    variant?: "primary" | "warning" | "error";
    slotProps?: {
        button?: ButtonProps;
    };
}

export default function ConfirmDialogButton(props: IConfirmDialogProps) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        props.onCancel?.();
    };

    const handleConfirm = () => {
        props.onConfirm?.();
        setOpen(false);
    };

    const getColor = () => {
        switch (props.variant) {
            case "error": return "error";
            case "warning": return "warning";
            default: return "primary";
        }
    };

    return (
        <>
            <Button
                {...props.slotProps?.button}
                onClick={handleOpen}
            />

            <Dialog open={open} onClose={handleClose}>
                {props.title && (
                    <DialogTitle color={getColor()}>
                        {props.title}
                    </DialogTitle>
                )}

                <DialogContent>
                    <Typography component={'div'}>{props.message}</Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color={getColor()} variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
