"use client"

import { TaskAltRounded } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography, Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile } from "@mui/icons-material";
import { SubmitCompletion } from "@/action/request";
import { useSnackbar } from "notistack";

export interface Props {
    designId: string;
}

export default function DrafCompletionDialog(props: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!props.designId) return;
        if (!file) return enqueueSnackbar("Please select file design!", { variant: 'error' });

        setLoading(true);
        try {
            const response = await SubmitCompletion({ file, message, id: props.designId, type: "design" });
            if (response.status) {
                setLoading(false);
                handleClose();
                enqueueSnackbar("Mark Completed Successfull", { variant: 'success' });
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || "Caught an Error", { variant: 'error' });
        } finally {
            setLoading(false)
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <>
            <Tooltip title="Draf new Completion" arrow>
                <Button onClick={handleOpen} variant="contained" color="primary">
                    Draf Completion
                </Button>
            </Tooltip>

            <AnimatePresence>
                {open && (
                    <Dialog
                        maxWidth="sm"
                        fullWidth
                        onClose={handleClose}
                        open={open}>
                        <DialogTitle
                            component={motion.div}
                            sx={{
                                backgroundColor: (theme) => theme.palette.primary.main,
                                color: (theme) => theme.palette.primary.contrastText,
                                py: 2,
                                px: 3
                            }}>
                            <Box display="flex" alignItems="center">
                                <TaskAltRounded sx={{ mr: 1 }} />
                                <Typography variant="h6">Draf New Completion</Typography>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ py: 3 }}>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}>
                                <Typography variant="body1" sx={{ mt: 3 }} gutterBottom>
                                    Please upload your design files and add any final comments
                                </Typography>

                                <Box
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        p: 4,
                                        textAlign: 'center',
                                        my: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                    component={motion.div}
                                    whileHover={{ scale: 1.01 }}>
                                    <input
                                        accept="image/*,.pdf,.psd,.ai,.xd"
                                        style={{ display: 'none' }}
                                        id="upload-file"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="upload-file">
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            <UploadFile fontSize="large" color="action" />
                                            <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                                {file ? file.name : 'Drag & drop files or click to browse'}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Supported formats: JPG, PNG, PDF, PSD, AI, XD
                                            </Typography>
                                        </Box>
                                    </label>
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Completion Message"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Add any final notes or comments..."
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                color="secondary"
                                component={motion.div}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading || !file}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                component={motion.div}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                sx={{
                                    backgroundColor: (theme) => theme.palette.success.main,
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.success.dark,
                                    }
                                }}>
                                {loading ? 'Submitting...' : 'Complete Task'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
}