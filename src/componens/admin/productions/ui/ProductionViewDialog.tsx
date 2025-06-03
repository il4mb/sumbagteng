"use client"

import DialogHeader from "@/componens/ui/DialogHeader";
import { db } from "@/firebase/config";
import { Completion, DesignRequest, ProductionRequest, RequestStatus, User } from "@/types";
import { Balance, Celebration, Description, ImageRounded, LocationCity, OpenInBrowserRounded, Place } from "@mui/icons-material";
import { alpha, Avatar, Box, Button, Chip, Collapse, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MarkAsFinishDialog from "./MarkAsFinishDialog";

export interface Props {
    productionId: string;
}

export default function ProductionViewDialog({ productionId }: Props) {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <Tooltip title="View Detail" arrow>
                <IconButton onClick={handleOpen}>
                    <OpenInBrowserRounded />
                </IconButton>
            </Tooltip>

            {open && (
                <DialogDetailProduction productionId={productionId} onClose={handleClose} open />
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
type Design = DesignRequest & {
    completion: Completion;
}

const DialogDetailProduction = ({ productionId, open, onClose }: DialogProps) => {

    const [expand, setExpand] = useState(true);
    const [creator, setCreator] = useState<User | null | undefined>(undefined);
    const [production, setProduction] = useState<ProductionRequest | undefined | null>();
    const [location, setLocation] = useState<Location>();
    const [cluster, setCluster] = useState<Cluster>();
    const [design, setDesign] = useState<Design | string | null>();

    useEffect(() => {
        const docRef = doc(db, "productions", productionId);
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
    }, [productionId])

    useEffect(() => {
        const fetchCreator = async () => {
            if (!production?.createdBy) return;
            const docRef = doc(db, "users", production.createdBy);
            const snap = await getDoc(docRef);

            if (!snap.exists()) return;
            setCreator({
                id: snap.id,
                ...snap.data()
            } as User);
        }
        fetchCreator();
    }, [production?.id]);

    useEffect(() => {
        if (production?.design?.type != "design") {
            if (production?.design?.type == "upload") {
                setDesign(production.design.value);
            }
            return;
        }

        const designRef = doc(db, 'designs', production.design.type);
        const unsubscribe = onSnapshot(designRef, async (snapshot) => {
            const data = snapshot.data();
            if (!data) return;

            const completionRef = collection(designRef, "completions");
            const queryCompletion = query(completionRef, where("status", "==", "accepted"), limit(1));
            const completion = (await getDocs(queryCompletion)).docs[0].data();

            const design = {
                id: snapshot.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                completion: {
                    ...completion,
                    completedAt: completion.completedAt.toDate(),
                    updatedAt: completion.updatedAt ? completion.updatedAt.toDate() : undefined,

                }
            } as Design;

            setDesign(design)
        });
        return () => unsubscribe();
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

                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Avatar
                        src={creator?.photo}
                        sx={{ width: 56, height: 56 }}
                    />
                    <Stack>
                        <Typography variant="h6">{creator?.name || 'Unknown'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Client
                        </Typography>
                    </Stack>
                </Stack>

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
                        </Collapse>

                        <Stack sx={{ mt: 2 }}>
                            <Box>
                                <Typography fontSize={18} fontWeight={700}>Ref Design</Typography>
                                <Typography fontSize={14} color="text.secondary">{typeof design == "object" ? design?.id : 'upload'}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', pb: 4, pt: 2 }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}>
                                    <Avatar
                                        variant="rounded"
                                        src={typeof design == "object"
                                            ? (
                                                design?.completion.image.startsWith("http")
                                                    ? design?.completion.image
                                                    : `/storage/${design?.completion.image}`
                                            )
                                            : (
                                                design?.startsWith("http")
                                                    ? design
                                                    : `/storage/${design}`
                                            )}
                                        sx={{ width: 600, height: 600, mx: 'auto' }} >
                                        <ImageRounded />
                                    </Avatar>

                                </motion.div>
                            </Box>
                        </Stack>
                    </Stack>

                </Stack>
            </DialogContent>
            {production?.status !== "finished" && (
                <DialogActions>
                    <Button color="secondary" variant="outlined">Close</Button>
                    <MarkAsFinishDialog id={productionId} />
                </DialogActions>
            )}
        </Dialog>
    )
}