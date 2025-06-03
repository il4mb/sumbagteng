"use client"
import { motion } from "framer-motion";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, AlertTitle, Avatar, Badge, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Completion } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ExpandMore } from "@mui/icons-material";
import DrafCompletionDialog from "./actions/DrafCompletionDialog";
import DialogHeader from "@/componens/ui/DialogHeader";

export interface ICompletionsDialogProps {
    text: string;
    designId: string;
}

export default function CompletionsDialog({ designId, text }: ICompletionsDialogProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [completions, setCompletions] = useState<Completion[]>([]);
    const isFinish = completions.some(e => e.status == "accepted");

    useEffect(() => {
        if (!designId) return;

        const coll = collection(db, "designs", designId, "completions");
        const q = query(coll, orderBy("completedAt", "asc"));

        const unsub = onSnapshot(q, (snap) => {
            // @ts-ignore
            const data: Completion[] = snap.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    status: d.status ?? "pending",
                    image: d.image ?? "",
                    message: d.message ?? "",
                    completedAt: d.completedAt?.toDate?.() ?? new Date(),
                    rejectMessage: d.rejectMessage
                };
            });

            setCompletions(data);
        });

        return () => unsub();
    }, [designId]);


    return (
        <>
            <Button
                onClick={handleOpen}
                variant="contained"
                color="primary"
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <Badge badgeContent={completions.length} color="warning">
                    {text}
                </Badge>
            </Button>

            {open && (
                <Dialog onClose={handleClose} maxWidth={'sm'} fullWidth open>
                    <DialogHeader title="Submitted Completions" onClose={handleClose} />
                    <DialogContent>

                        {isFinish && (
                            <Alert severity="warning" sx={{ my: 2 }}>
                                <AlertTitle fontWeight={700} fontSize={16}>Request Closed!</AlertTitle>
                                <Typography>This request has been closed.</Typography>
                            </Alert>
                        )}

                        {completions.length <= 0 && (
                            <Alert severity="warning" sx={{ my: 2 }}>
                                <AlertTitle fontWeight={700} fontSize={16}>No Submissions Yet</AlertTitle>
                                <Typography>
                                    There are currently no completion submissions for this design.
                                </Typography>
                            </Alert>
                        )}

                        {completions.map((c, i) => (
                            <Accordion key={i} defaultExpanded={i + 1 === completions.length}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                        <Typography fontWeight={600} sx={{ flexGrow: 1 }}>
                                            Completion #{i + 1}
                                            {c.status === "accepted" && i + 1 === completions.length ? (
                                                <Chip sx={{ ml: 1, textTransform: 'capitalize' }} label="Final Accepted" color="primary" />
                                            ) : (
                                                <Chip sx={{ ml: 1, textTransform: 'capitalize' }} label={c.status} color={c.status === "rejected" ? "error" : "warning"} />
                                            )}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {c.completedAt.toLocaleDateString("id-ID", {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Typography>
                                    </Stack>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <Avatar
                                            src={`/storage/${c.image}`}
                                            alt={`Completion #${i + 1}`}
                                            style={{
                                                width: '500px',
                                                height: '500px',
                                                borderRadius: 8,
                                                maxHeight: 500,
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <Typography>
                                            {c.message || "No message provided."}
                                        </Typography>

                                        {c.status === "rejected" && (
                                            <Box sx={{ p: 2, background: "#88888833", borderRadius: 1 }}>
                                                <Typography fontWeight={700} gutterBottom>
                                                    Rejection Reason
                                                </Typography>
                                                <Typography>
                                                    {c.rejectMessage || "No rejection message provided."}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </DialogContent>
                    {!isFinish && (
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">Close</Button>
                            <DrafCompletionDialog designId={designId} />
                        </DialogActions>
                    )}
                </Dialog>
            )}

        </>
    );
}
