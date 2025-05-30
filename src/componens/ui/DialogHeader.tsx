import { Close } from '@mui/icons-material';
import { DialogTitle, IconButton, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export interface IDialogHeaderProps {
    title: string;
    onClose: () => void;
}

export default function DialogHeader({ title, onClose }: IDialogHeaderProps) {
    const theme = useTheme();
    return (
        <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
            py: 1,
            px: 3,
            mb: 3
        }}>
            <Typography component={"div"} variant="h6">{title}</Typography>
            <IconButton
                onClick={onClose}
                sx={{ color: 'inherit' }}
                component={motion.div}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}>
                <Close />
            </IconButton>
        </DialogTitle>
    );
}
