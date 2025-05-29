import { useAuth } from '@/componens/AuthProvider';
import { db } from '@/firebase/config';
import { DesignRequest } from '@/types';
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
    CardActions,
    Box
} from '@mui/material';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface ISelectDesignDialogProps {
    onSelect: (designId: string) => void;
}

export default function SelectDesignDialog({ onSelect }: ISelectDesignDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [designs, setDesigns] = useState<DesignRequest[]>([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectDesign = (designId: string) => {
        onSelect(designId);
        handleClose();
    }

    useEffect(() => {
        if (!user?.uid) return;
        const c = collection(db, 'designs');
        const w = query(c, where('status', '==', 'completed'), where('createdBy', '==', user.uid));
        const unsubscribe = onSnapshot(w, (snapshot) => {
            const designData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DesignRequest));
            setDesigns(designData);
        });
        return () => unsubscribe();
    }, [user?.uid]);

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
                                            {design.image && (
                                                <CardMedia
                                                    component="img"
                                                    height="160"
                                                    image={design.image}
                                                    alt={design.name || 'Design thumbnail'}
                                                    sx={{ objectFit: 'cover', mx: 0, height: 200 }}
                                                />
                                            )}
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {design.name || 'Untitled Design'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Created: {new Date(design.createdAt?.seconds * 1000).toLocaleDateString()}
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