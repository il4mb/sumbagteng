"use client"
import { AspectRatio, Ballot, CalendarToday, Description, ImageRounded, OpenInBrowserRounded, Style, Update } from '@mui/icons-material';
import {
    Dialog,
    DialogContent,
    IconButton,
    Tooltip,
    Stack,
    Typography,
    Box,
    Button,
    Grid,
    Avatar,
    Chip,
    Collapse,
    alpha,
    Alert,
    AlertTitle,
    Accordion,
    AccordionSummary,
    AccordionActions,
    AccordionDetails,
    Divider
} from '@mui/material';
import { MappedRequest } from '../RequestGrid';
import { useEffect, useState } from 'react';
import { DesignRequest, RequestStatus, User } from '@/types';
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from '@/firebase/config';
import { AnimatePresence, motion } from 'framer-motion';
import DialogHeader from '@/componens/ui/DialogHeader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RequestRevitionDialog from './ui/RequestRevitionDialog';
import ConfirmCompletionDialog from './ui/ConfirmCompletionDialog';

export interface Props {
    row: MappedRequest;
}

export default function DesignViewDialog(props: Props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="View details">
                <IconButton color="primary" onClick={handleOpen}>
                    <OpenInBrowserRounded fontSize="small" />
                </IconButton>
            </Tooltip>

            {open && (
                <DialogDetailDesign row={row} onClose={handleClose} open />
            )}

        </>
    );
}

type DialogProps = Props & {
    open: boolean;
    onClose: () => void;
}

const DialogDetailDesign = ({ row, open, onClose }: DialogProps) => {

    const [expand, setExpand] = useState(false);
    const [executor, setExecutor] = useState<User | null | undefined>(undefined);
    const [design, setDesign] = useState<DesignRequest | undefined | null>();

    useEffect(() => {
        const docRef = doc(db, "designs", row.id);
        const unsub = onSnapshot(docRef, snapshoot => {
            const data = snapshoot.data() as Omit<DesignRequest, "createdAt" | "updatedAt"> & { createdAt: Timestamp; updatedAt?: Timestamp };
            setDesign({
                ...data,
                id: snapshoot.id,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
            } as DesignRequest)
        })

        return () => {
            unsub();
        }
    }, [row.id])

    useEffect(() => {
        const fetchExecutor = async () => {
            if (!row.executedBy) return;
            const docRef = doc(db, "users", row.executedBy);
            const snap = await getDoc(docRef);

            if (!snap.exists()) return;
            setExecutor({
                id: snap.id,
                ...snap.data()
            } as User);
        }
        fetchExecutor();
    }, [design?.id]);

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

    const getColor = (status?: RequestStatus) =>
        status == "finished" ? "primary"
            : status == "accepted" ? "success"
                : status == "pending" ? "warning"
                    : "secondary"


    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: 2, boxShadow: 24, maxWidth: '800px', } } }}>

            <DialogHeader title='Request Detail' onClose={onClose} />

            <DialogContent sx={{ py: 2, px: 3 }}>
                <Stack spacing={2}>

                    {/* Details Section */}
                    <Stack spacing={2}>

                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Box>
                                <Typography fontSize={22} fontWeight={700}>
                                    {design?.name || "No name"}
                                    <Chip label={design?.status} color={getColor(design?.status)} sx={{ textTransform: "capitalize", ml: 2 }} />
                                </Typography>
                                <Typography color='text.secondary'>
                                    {formatDate(design?.createdAt)}
                                </Typography>
                            </Box>
                            <Button onClick={() => setExpand(!expand)} variant='outlined' color='secondary'>
                                {expand ? "Hide Details" : "Request Details"}
                            </Button>
                        </Stack>

                        <Collapse in={expand}>
                            <Grid container sx={{ mb: 1 }}>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Style color="action" />
                                        <Typography>
                                            <strong>Theme:</strong> {design?.theme}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <CalendarToday color="action" />
                                        <Typography>
                                            <strong>Created:</strong> {formatDate(design?.createdAt)}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <AspectRatio color="action" />
                                        <Typography>
                                            <strong>Size:</strong> {design?.size}
                                        </Typography>
                                    </Stack>

                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Update color="action" />
                                        <Typography>
                                            <strong>Last Updated:</strong> {design && formatDate(design.updatedAt)}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Ballot color="action" />
                                        <Typography>
                                            <strong>Type:</strong> {design?.type}
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
                                        {design?.description || 'No description provided'}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Box sx={{ mt: 2 }}>
                                <Typography fontWeight={700} gutterBottom>Design Reference:</Typography>
                                <AnimatePresence>
                                    <Stack direction={'row'} spacing={2} sx={{ overflow: 'auto' }}>
                                        {design?.images && (
                                            design?.images.map((img, index) => (
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
                            <Divider />
                        </Collapse>
                    </Stack>



                    {executor && (
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={executor?.photo}
                                sx={{ width: 56, height: 56 }}
                            />
                            <Stack>
                                <Typography variant="h6">{executor?.name || 'Unknown'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Executor
                                </Typography>
                            </Stack>
                        </Stack>
                    )}

                    {design && (
                        <Stack sx={{ minHeight: 200 }}>
                            {design?.status == "pending" ? (
                                <Typography fontSize={22} fontWeight={700} sx={{ py: 8, maxWidth: '600px', whiteSpace: 'wrap', textAlign: 'center', mx: 'auto' }}>
                                    Your application is currently in the queue, Please be patient!
                                </Typography>
                            ) : (
                                <CompletionList status={design?.status} id={design?.id} />
                            )}

                        </Stack>
                    )}

                </Stack>
            </DialogContent>
        </Dialog>
    )
}




type Completion = {
    id: string;
    image: string;
    message: string;
    completeAt: Date;
    status: string;
    rejectMessage?: string;
};

const CompletionList = ({ id, status }: { id: string; status: RequestStatus; }) => {
    const [completions, setCompletions] = useState<Completion[]>([]);

    useEffect(() => {

        console.log(id)
        if (!id) return;

        const coll = collection(db, "designs", id, "completions");
        const q = query(coll, orderBy("completedAt", "asc"));

        const unsub = onSnapshot(q, (snap) => {
            const data: Completion[] = snap.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    status: d.status ?? "pending",
                    image: d.image ?? "",
                    message: d.message ?? "",
                    completeAt: d.completeAt?.toDate?.() ?? new Date(),
                    rejectMessage: d.rejectMessage
                };
            });

            console.log(data)

            setCompletions(data);
        });

        return () => unsub();
    }, [id]);

    return (
        <Stack spacing={2}>
            <Typography fontWeight={700} fontSize={20}>
                Completion List
            </Typography>

            {completions.length === 0 ? (
                <Alert severity='warning'>
                    <AlertTitle>No Completions Yet</AlertTitle>
                    <Typography>There are currently no completions submitted.</Typography>
                </Alert>
            ) : (
                <Box>
                    {completions.map((c, i) => (
                        <Accordion key={i} defaultExpanded={i + 1 == completions.length}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                        {c.completeAt.toLocaleDateString("id-ID", {
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
                                        style={{ width: '100%', height: '100%', borderRadius: 8, maxHeight: 500, objectFit: 'cover' }}
                                    />
                                    <Typography>{c.message}</Typography>
                                    {c.status == "rejected" && (
                                        <Box sx={{ p: 2, background: "#88888855", borderRadius: 1 }}>
                                            <Typography fontWeight={700}>Reject Reason:</Typography>
                                            <Typography sx={{ p: 1 }}>
                                                {c.rejectMessage}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </AccordionDetails>
                            {c.status == "pending" && i + 1 === completions.length && (
                                <AccordionActions>
                                    <RequestRevitionDialog id={id} completionId={c.id} />
                                    <ConfirmCompletionDialog id={id} completionId={c.id} />
                                </AccordionActions>
                            )}
                        </Accordion>
                    ))}
                </Box>
            )
            }
        </Stack >
    );
};