"use client"

import { Stack, TextField, MenuItem, Box, Grid, InputAdornment } from "@mui/material";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SelectDesignDialog from "./SelectDesignDialog";
import ImagePickerButton from "@/componens/ui/ImagePickerButton";
import { useAllocations, useBranches, useClusters, useDesignTypes } from "@/componens/ctx/hooks";
import { DesignSize, DesignType } from "@/types";

export interface IProductionFormProps {
    data: ProductionFormData;
    onUpdate: Dispatch<SetStateAction<ProductionFormData>>;
}

type DesignRef = {
    type: 'design';
    value: string;
}
type UploadRef = {
    type: 'upload';
    value: File;
}
export type ProductionFormData = {
    branch: string;
    cluster: string;
    allocation: string;
    quantity: number;
    designRef: DesignRef | UploadRef;
    designType: DesignType['id'];
    designSize: DesignSize['value'];
    description: string;
};


export default function ProductionForm({ data, onUpdate }: IProductionFormProps) {
    const [branchId, setBranchId] = useState('');
    const [designTypeId, setDesignTypeId] = useState('');

    const { branch, cluster, allocation, quantity, designRef, designType, designSize, description } = data;
    const [errors, setErrors] = useState<Partial<Omit<ProductionFormData, "quantity"> & { quantity: string }>>({});
    const branches = useBranches();
    const clusters = useClusters({ branchId });
    const allocations = useAllocations();
    const { types, sizes } = useDesignTypes({ id: designTypeId });

    useEffect(() => {
        const find = branches.find(b => b.id == branchId);
        onUpdate(prev => ({ ...prev, branch: find?.name || '' }));
    }, [branchId]);


    useEffect(() => {
        const find = types.find(b => b.id == designTypeId);
        onUpdate(prev => ({ ...prev, designType: find?.name || '' }));
    }, [designTypeId]);



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
                                label="Branch"
                                name="branch"
                                value={branchId}
                                onChange={(e) => setBranchId(e.target.value)}
                                error={!!errors.branch}
                                helperText={errors.branch}
                                fullWidth
                                required>
                                {branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                select
                                label="Cluster"
                                name="cluster"
                                disabled={!branch}
                                value={cluster}
                                onChange={handleInputChange}
                                error={!!errors.cluster}
                                helperText={!branch ? "please select branch first!" : errors.cluster}
                                fullWidth
                                required>
                                {clusters.map((option) => (
                                    <MenuItem key={option.name} value={option.name}>
                                        {option.name}
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
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Design Reference"
                                name="designRef"
                                value={`${designRef?.type == "design"
                                    ? `DESIGN: ${designRef?.value}` : designRef?.type == 'upload'
                                        ? `UPLOAD: ${designRef?.value.name}` : "NONE"}`}
                                fullWidth
                                required
                                placeholder="Enter design ID or reference number"
                                slotProps={{
                                    input: {
                                        sx: { pr: 0, mr: 0 },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <ImagePickerButton
                                                    onPick={(file) => {
                                                        onUpdate(prev => ({
                                                            ...prev,
                                                            designRef: {
                                                                value: file,
                                                                type: 'upload'
                                                            }
                                                        }))
                                                    }} />
                                                <SelectDesignDialog
                                                    onSelect={(id) => {
                                                        onUpdate(prev => ({
                                                            ...prev,
                                                            designRef: {
                                                                value: id,
                                                                type: 'design'
                                                            }
                                                        }))
                                                    }} />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                select
                                label="Design Type"
                                name="designType"
                                value={designTypeId}
                                onChange={(e) => setDesignTypeId(e.target.value)}
                                error={!!errors.designType}
                                helperText={errors.designType}
                                fullWidth
                                required>
                                {types.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                select
                                label="Design Size"
                                name="designSize"
                                value={designSize}
                                onChange={handleInputChange}
                                disabled={!designType}
                                error={!!errors.designSize}
                                helperText={errors.designSize}
                                fullWidth
                                required>
                                {sizes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
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