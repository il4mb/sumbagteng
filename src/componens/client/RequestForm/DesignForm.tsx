"use client"

import { Stack, TextField, Box, Grid, Chip, IconButton, Tooltip, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useRef, Dispatch, SetStateAction, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { UploadFile } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { collection, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

const validateImageUrl = (url: string): boolean => {
    try {
        // Basic URL validation
        const urlObj = new URL(url);

        // Check if the URL has a valid protocol (http or https)
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }

        // Check for common image file extensions
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasImageExtension = imageExtensions.some(ext =>
            urlObj.pathname.toLowerCase().endsWith(ext)
        );

        return hasImageExtension;
    } catch (e) {
        return false; // Invalid URL format
    }
};

export type DesignFormData = {
    name: string;
    type: string;
    size: string;
    theme: string;
    images: ImageSource[];
    description: string;
}

export interface IProductionFormProps {
    data: DesignFormData;
    onUpdate: Dispatch<SetStateAction<DesignFormData>>;
}

type ImageSource = {
    type: 'url' | 'upload';
    value: string;
    file?: File;
};

type TSize = {
    name: string;
    value: string;
}

export default function DesignForm({ data, onUpdate }: IProductionFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { name, size, theme, images, description, type } = data;
    const [newImageUrl, setNewImageUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [designTypes, setDesignTypes] = useState<string[]>([]);
    const [designSizes, setDesignSizes] = useState<TSize[]>([]);

    useEffect(() => {
        const typesRef = collection(db, "design-types");
        const unSub = onSnapshot(typesRef, (snapshot) => {
            const wewDesignTypes = snapshot.docs.map(doc => doc.data().name);
            setDesignTypes(wewDesignTypes);
        })
        return () => {
            unSub();
        }
    }, []);

    useEffect(() => {
        console.log("TYPE", type);
        if (!type) return;
        const typesRef = collection(db, "design-types");
        const typeQuery = query(typesRef, where('name', '==', type), limit(1));

        const unSub = onSnapshot(typeQuery, async (snapshot) => {
            const typeId = snapshot.docs[0].id;
            const sizesRef = collection(db, "design-types", typeId, "sizes");
            const sizeSnapshoot = await getDocs(sizesRef);
            const sizes = sizeSnapshoot.docs.map((doc) => ({ ...doc.data() } as TSize));
            setDesignSizes(sizes);
        });
        return () => {
            unSub();
        }
    }, [type]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate(prev => ({ ...prev, [name]: value }));
    };

    const handleAddImage = () => {
        const trimmedUrl = newImageUrl.trim();

        if (!trimmedUrl) {
            // Handle empty URL case
            enqueueSnackbar('Please enter a valid image URL.', {
                variant: 'error',
            });
            return;
        }

        if (!validateImageUrl(trimmedUrl)) {
            enqueueSnackbar('Invalid image URL. Please provide a valid URL ending with an image extension.', {
                variant: 'error',
            });
            return;
        }

        onUpdate(prev => ({
            ...prev,
            images: [...prev.images, { type: 'url', value: trimmedUrl }]
        }));

        setNewImageUrl('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            onUpdate(prev => ({
                ...prev,
                images: [...prev.images, { type: 'upload', value: objectUrl, file }]
            }));
        }
    };

    const handleRemoveImage = (index: number) => {
        onUpdate(prev => {
            const newImages = [...prev.images];
            if (newImages[index].type === 'upload') {
                URL.revokeObjectURL(newImages[index].value);
            }
            newImages.splice(index, 1);
            return { ...prev, reference: newImages };
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Stack spacing={3} sx={{ maxWidth: 600, mx: 'auto' }}>

                {/* Images Display */}
                {images.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {images.map((image, index) => (
                            <Chip
                                key={index}
                                label={image.type === 'url' ?
                                    `URL: ${image.value.substring(0, 20)}...` :
                                    `Upload: ${image.file?.name.substring(0, 20)}...`}
                                onDelete={() => handleRemoveImage(index)}
                                deleteIcon={<CloseIcon />}
                                variant="outlined"
                                sx={{ maxWidth: 200 }}
                            />
                        ))}
                    </Box>
                )}

                {/* Image Input */}
                <Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            label="Image URL"
                            placeholder="https://example.com/image.jpg"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddImage();
                                }
                            }}
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton
                                            onClick={handleAddImage}
                                            disabled={!newImageUrl.trim()}
                                            edge="end">
                                            <AddIcon />
                                        </IconButton>
                                    )
                                }
                            }}
                        />
                        <Tooltip title="Upload File" arrow>
                            <IconButton
                                color="primary"
                                onClick={triggerFileInput}
                                sx={{ height: '56px', width: '56px' }}>
                                <UploadFile />
                            </IconButton>
                        </Tooltip>
                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid size={12}>
                        {/* Name */}
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <TextField
                                label="Name"
                                name="name"
                                value={name}
                                onChange={handleInputChange}
                                fullWidth
                                required />
                        </motion.div>
                    </Grid>
                    <Grid size={6}>
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <TextField
                                select
                                label="Type"
                                name="type"
                                value={type}
                                onChange={handleInputChange}
                                fullWidth
                                required>
                                {designTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </motion.div>
                    </Grid>
                    <Grid size={6}>
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <TextField
                                select
                                name="size"
                                label="Size"
                                value={size}
                                onChange={handleInputChange}
                                fullWidth
                                required>
                                {designSizes.map((size, i) => (
                                    <MenuItem key={i} value={size.value}>
                                        {size.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </motion.div>
                    </Grid>
                    <Grid size={6}>
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <TextField
                                label="Theme"
                                name="theme"
                                value={theme}
                                onChange={handleInputChange}
                                fullWidth
                                required />
                        </motion.div>
                    </Grid>
                    <Grid size={12}>
                        {/* Description */}
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <TextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </motion.div>
                    </Grid>
                </Grid>
            </Stack>
        </motion.div>
    );
}