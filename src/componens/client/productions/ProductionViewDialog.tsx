"use client"
import { Balance, Celebration, Description, ImageRounded, LocationCity, OpenInBrowserRounded, Pallet, Place } from '@mui/icons-material';
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
    AlertTitle
} from '@mui/material';
import { MappedRequest } from '../RequestGrid';
import { useEffect, useState } from 'react';
import { DesignRequest, ProductionRequest, RequestStatus, User } from '@/types';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { db } from '@/firebase/config';
import DialogHeader from '@/componens/ui/DialogHeader';

export interface Props {
    row: MappedRequest;
}

export default function ProductionViewDialog(props: Props) {
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
                <DialogDetailProduction row={row} onClose={handleClose} open />
            )}

        </>
    );
}

type DialogProps = Props & {
    open: boolean;
    onClose: () => void;
}
type Location = {
    id: string;
    name: string;
    city: string;
}
type Cluster = {
    id: string;
    name: string;
}

const DialogDetailProduction = ({ row, open, onClose }: DialogProps) => {

    const [expand, setExpand] = useState(false);
    const [executor, setExecutor] = useState<User | null | undefined>(undefined);
    const [production, setProduction] = useState<ProductionRequest | undefined | null>();
    const [location, setLocation] = useState<Location>();
    const [cluster, setCluster] = useState<Cluster>();
    const [design, setDesign] = useState<string | null>(null);

    useEffect(() => {
        const docRef = doc(db, "productions", row.id);
        const unsub = onSnapshot(docRef, async (snapshoot) => {
            const data = snapshoot.data() as Omit<ProductionRequest, "createdAt" | "updatedAt"> & { createdAt: Timestamp; updatedAt?: Timestamp };

            const locationRef = doc(db, "locations", data.location);
            const locationSnap = await getDoc(locationRef);
            setLocation({ ...locationSnap.data(), id: locationSnap.id } as Location);

            const clusterRef = doc(locationRef, "clusters", data.cluster);
            const clusterSnap = await getDoc(clusterRef);
            setCluster({ ...clusterSnap.data(), id: clusterSnap.id } as Location);


            setProduction({
                ...data,
                id: snapshoot.id,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
            } as ProductionRequest);
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
        const fetchDesign = async () => {
            if (production?.design?.type == "design") {
                const designId = production.design.value;
                const completionRef = collection(db, "designs", designId, "completions");
                const queryCompletion = query(completionRef, where("status", "==", "accepted"), limit(1));
                const completion = (await getDocs(queryCompletion)).docs[0].data();
                if (completion) {
                    setDesign(completion.image);
                }
            } else if (production?.design?.type == "upload") {
                setDesign("/storage/" + production.design.value.replace(/^\//, ''));
            }
        }
        fetchDesign();
        fetchExecutor();
    }, [production?.id]);

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
                    <Stack spacing={2}>

                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Box>
                                <Typography fontSize={22} fontWeight={700}>
                                    {production?.title || "Untitled #" + production?.id}
                                    <Chip label={production?.status} color={getColor(production?.status)} sx={{ textTransform: "capitalize", ml: 2 }} />
                                </Typography>
                                <Typography color='text.secondary'>
                                    {formatDate(production?.createdAt)}
                                </Typography>
                            </Box>
                            <Button onClick={() => setExpand(!expand)} variant='outlined' color='secondary'>
                                {expand ? "Hide Details" : "Request Details"}
                            </Button>
                        </Stack>

                        <Collapse in={expand}>
                            <Grid container>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Place color="action" />
                                        <Typography>
                                            <strong>Location:</strong> {location?.city}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <LocationCity color="action" />
                                        <Typography>
                                            <strong>Cluster:</strong> {cluster?.name}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Celebration color="action" />
                                        <Typography>
                                            <strong>Allocation:</strong> {production?.allocation}
                                        </Typography>
                                    </Stack>

                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Balance color="action" />
                                        <Typography>
                                            <strong>Quantity:</strong> {production?.quantity}
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
                                        {production?.description || 'No description provided'}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Pallet color="action" sx={{ mt: 2 }} />
                                <Stack>
                                    <Typography gutterBottom><strong>Design:</strong></Typography>
                                    <Avatar src={design || ""} variant='rounded' sx={{ width: 250, height: 200 }}>
                                        <ImageRounded sx={{ width: 150, height: 100 }} />
                                    </Avatar>
                                </Stack>
                            </Stack>
                        </Collapse>
                    </Stack>



                    {executor ? (
                        <>
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
                            <Alert>
                                <AlertTitle fontSize={16}>Request is Under processing!</AlertTitle>
                                <Typography>Your request was accepted by {executor.name}. Please be patient {executor.name} will update the status soon.</Typography>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert severity='warning'>
                                <AlertTitle fontSize={16}>
                                    No Taker yet
                                </AlertTitle>
                                <Typography>You request currenly is in queque</Typography>
                            </Alert>
                        </>
                    )}

                </Stack>
            </DialogContent>
        </Dialog>
    )
}