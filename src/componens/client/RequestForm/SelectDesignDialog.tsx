import { useAuth } from '@/componens/AuthProvider';
import { db } from '@/firebase/config';
import { Completion, DesignRequest } from '@/types';
import { TouchAppRounded } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface ISelectDesignDialogProps {
    onSelect: (designId: string) => void;
}

type CompletedDesign = DesignRequest & { completion: Completion }

export default function SelectDesignDialog({ onSelect }: ISelectDesignDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [designs, setDesigns] = useState<CompletedDesign[]>([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectDesign = (designId: string) => {
        onSelect(designId);
        handleClose();
    }

    useEffect(() => {
        if (!user?.id) return;
        const c = collection(db, 'designs');
        const w = query(c,
            where('status', '==', 'finished'),
            where('createdBy', '==', user.id),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(w, async (snapshot) => {
            const designData = await Promise.all(snapshot.docs.map(async doc => {
                const data = doc.data();

                const completionRef = collection(c, doc.id, "completions");
                const queryCompletion = query(completionRef, where("status", "==", "accepted"), limit(1));
                const completion = (await getDocs(queryCompletion)).docs[0].data();

                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                    completion: {
                        ...completion,
                        completedAt: completion.completedAt.toDate(),
                        updatedAt: completion.updatedAt ? completion.updatedAt.toDate() : undefined,

                    }
                } as CompletedDesign
            }));

            setDesigns(designData);
        });
        return () => unsubscribe();
    }, [user?.id]);

    return (
        <>
            <Tooltip title="Select Design from Library" placement="top" arrow>
                <IconButton color="primary" onClick={handleOpen}>
                    <TouchAppRounded />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth>
                <DialogTitle>Select a Design</DialogTitle>
                <DialogContent>
                    {designs.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 200
                        }}>
                            <Typography variant="body1" color="text.secondary">
                                No completed designs found in your library.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {designs.map(design => (
                                <Tooltip title={"Select " + (design.name || 'Untitled Design')} key={design.id}>
                                    <Grid size={4} onClick={() => handleSelectDesign(design.id)}>
                                        <Card sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 2,
                                            border: 'none',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            "&:hover": {
                                                boxShadow: 3,
                                                cursor: 'pointer',
                                                transform: 'scale(1.02)'
                                            }
                                        }}>
                                            {design.completion && (
                                                <CardMedia
                                                    component="img"
                                                    height="160"
                                                    image={`/storage/${design.completion.image}`}
                                                    alt={design.name || 'Design thumbnail'}
                                                    sx={{ objectFit: 'cover', mx: 0, height: 200 }}
                                                />
                                            )}
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {design.name || 'Untitled Design'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Created: {design.completion.completedAt?.toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Tooltip>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}