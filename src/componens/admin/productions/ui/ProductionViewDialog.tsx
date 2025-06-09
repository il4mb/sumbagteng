"use client"

import DialogHeader from "@/componens/ui/DialogHeader";
import { ProductionRequest, RequestStatus } from "@/types";
import { Balance, Celebration, Description, ImageRounded, LocationCity, OpenInBrowserRounded, Place } from "@mui/icons-material";
import { alpha, Avatar, Box, Button, Chip, Collapse, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MarkAsFinishDialog from "./MarkAsFinishDialog";
import { useDesignRequest, useUser } from "@/componens/ctx/hooks";

export interface Props {
    production: ProductionRequest;
}

export default function ProductionViewDialog({ production }: Props) {

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
                <DialogDetailProduction
                    production={production}
                    onClose={handleClose}
                    open />
            )}
        </>
    );
}


type DialogProps = Props & {
    open: boolean;
    onClose: () => void;
}
const DialogDetailProduction = ({ production, open, onClose }: DialogProps) => {

    const [expand, setExpand] = useState(true);
    const design = useDesignRequest(production.design?.type == "design" ? production.design?.value : null);
    const creator = useUser({ id: production.createdBy });
    const [designImg, setDesignImg] = useState<string>();

    useEffect(() => {

        if (production?.design?.type != "design") {
            if (production?.design?.type == "upload") {
                setDesignImg(production.design.value);
            }
            return;
        }

        if (design) setDesignImg(design.completions.find(e => e.status == "accepted")?.image || '')

    }, [production.id, design]);

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
                                    {"#" + production?.id}
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
                                            <strong>Branch:</strong> {production.branch}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={6} sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <LocationCity color="action" />
                                        <Typography>
                                            <strong>Cluster:</strong> {production.cluster}
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
                            <Stack direction={'row'} sx={{ pb: 4, pt: 2 }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}>
                                    <Avatar
                                        variant="rounded"
                                        src={designImg}
                                        sx={{ width: 400, height: 400 }} >
                                        <ImageRounded />
                                    </Avatar>
                                </motion.div>
                                <Box sx={{ p: 2 }}>
                                    <Typography>
                                        <strong>Type:</strong> {production?.designType}
                                    </Typography>

                                    <Typography>
                                        <strong>Size:</strong> {production?.designSize}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>

                </Stack>
            </DialogContent>
            {production?.status !== "finished" && (
                <DialogActions>
                    <Button color="secondary" variant="outlined">Close</Button>
                    <MarkAsFinishDialog id={production.id} />
                </DialogActions>
            )}
        </Dialog>
    )
}