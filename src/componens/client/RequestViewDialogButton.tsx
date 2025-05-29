import { OpenInBrowserRounded } from '@mui/icons-material';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Stack,
    Typography,
    Box,
    Divider,
    Button,
    Grid
} from '@mui/material';
import * as React from 'react';
import { MappedRequest } from './RequestGrid';
import { StatusProgress } from '../ui/VerticalProgress';

export interface Props {
    row: MappedRequest;
}

export default function RequestViewDialogButton(props: Props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="View details">
                <IconButton color="primary" onClick={handleOpen}>
                    <OpenInBrowserRounded fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}

                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 2,
                            maxWidth: '800px',
                        }
                    }
                }}>
                <DialogTitle variant="h5" sx={{ py: 2, px: 3 }}>
                    Request Details
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ py: 2, px: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={4} sx={{ display: 'flex', alignItems: 'center' }}>
                            <StatusProgress status={row.status.toLocaleLowerCase() as any} />
                        </Grid>
                        <Grid size={8}>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">ID:</Typography>
                                    <Typography variant="body1" sx={{ ml: 2 }}>{row.id}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Type:</Typography>
                                    <Typography variant="body1" sx={{ ml: 2 }}>{row.type}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
                                    <Typography variant="body1" sx={{ ml: 2 }}>
                                        {row.status}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                                    <Typography variant="body1" sx={{ ml: 2 }}>{row.description}</Typography>
                                </Box>

                                <Stack direction="row" spacing={4}>
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" color="text.secondary">Created At:</Typography>
                                        <Typography variant="body1" sx={{ ml: 2 }}>{row.createdAt}</Typography>
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" color="text.secondary">Updated At:</Typography>
                                        <Typography variant="body1" sx={{ ml: 2 }}>{row.updatedAt}</Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{ px: 3, borderRadius: 1 }}>
                        Close
                    </Button>
                </Box>
            </Dialog>
        </>
    );
}