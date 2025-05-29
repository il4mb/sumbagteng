"use client"

import { db } from "@/firebase/config";
import { TouchAppRounded } from "@mui/icons-material";
import { Stack, TextField, MenuItem, Box, Grid, InputAdornment } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SelectDesignDialog from "./SelectDesignDialog";

export interface IProductionFormProps {
    data: ProductionFormData;
    onUpdate: Dispatch<SetStateAction<ProductionFormData>>;
}

export type ProductionFormData = {
    location: string;
    cluster: string;
    allocation: string;
    quantity: number;
    designRef: string;
    description: string;
};


export default function ProductionForm({ data, onUpdate }: IProductionFormProps) {
    const { location, cluster, allocation, quantity, designRef, description } = data;
    const [errors, setErrors] = useState<Partial<Omit<ProductionFormData, "quantity"> & { quantity: string }>>({});
    const [locations, setLocations] = useState<{ label: string, value: string; }[]>([]);
    const [clusters, setClusters] = useState<{ label: string, value: string; }[]>([]);
    const [allocations, setAllocations] = useState<{ label: string, value: string; }[]>([]);

    useEffect(() => {
        const c = collection(db, 'locations');
        onSnapshot(c, (snapshot) => {
            const clusterData = snapshot.docs.map(doc => ({ value: doc.id, label: doc.data().name }));
            setLocations(clusterData);
        });
        const a = collection(db, 'allocations');
        onSnapshot(a, (snapshot) => {
            const allocationData = snapshot.docs.map(doc => ({ value: doc.id, ...doc.data() } as { label: string, value: string; }));
            setAllocations(allocationData);
        });
    }, []);

    useEffect(() => {
        if (!location) return;
        const c = collection(db, 'locations', location, 'clusters');
        onSnapshot(c, (snapshot) => {
            const clusterData = snapshot.docs.map(doc => ({ value: doc.id, label: doc.data().name }));
            setClusters(clusterData);
        });
    }, [location]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate((prev: any) => ({
            ...prev,
            [name]: name === 'quantity' ? Number(value) : value
        } as ProductionFormData));

        // Clear error when user starts typing
        if (errors[name as keyof ProductionFormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<typeof errors> = {};

        if (!location) newErrors.location = 'Location is required';
        if (!cluster) newErrors.cluster = 'Cluster is required';
        if (!allocation) newErrors.allocation = 'Allocation is required';
        if (quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
        if (!designRef) newErrors.designRef = 'Design reference is required';
        if (description && description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        } else if (description && description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Stack spacing={3}>
                    <Grid container spacing={3}>
                        <Grid size={6}>
                            <TextField
                                select
                                label="Location"
                                name="location"
                                value={location}
                                onChange={handleInputChange}
                                error={!!errors.location}
                                helperText={errors.location}
                                fullWidth
                                required>
                                {locations.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                select
                                label="Cluster"
                                name="cluster"
                                disabled={!location}
                                value={cluster}
                                onChange={handleInputChange}
                                error={!!errors.cluster}
                                helperText={!location ? "please select location first!" : errors.cluster}
                                fullWidth
                                required>
                                {clusters.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                select
                                label="Allocation"
                                name="allocation"
                                value={allocation}
                                onChange={handleInputChange}
                                error={!!errors.allocation}
                                helperText={errors.allocation}
                                fullWidth
                                required>
                                {allocations.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={quantity}
                                onChange={handleInputChange}
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                                fullWidth
                                required
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Design Reference"
                                name="designRef"
                                value={designRef}
                                onChange={handleInputChange}
                                error={!!errors.designRef}
                                helperText={errors.designRef}
                                fullWidth
                                required
                                placeholder="Enter design ID or reference number"
                                slotProps={{
                                    input: {
                                        sx: { pr: 0, mr: 0 },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SelectDesignDialog onSelect={(id) => { onUpdate(prev => ({ ...prev, designRef: id })) }} />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={handleInputChange}
                                error={!!errors.description}
                                helperText={errors.description}
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Provide additional details about the production request"
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </motion.div>
    );
}