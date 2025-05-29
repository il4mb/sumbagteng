'use client';

import { AdfScannerRounded, PaletteRounded } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, MenuItem, Typography, } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductionForm, { ProductionFormData } from './RequestForm/ProductionForm';
import DesignForm, { DesignFormData } from './RequestForm/DesignForm';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useSnackbar } from 'notistack';
import { useAuth } from '../AuthProvider';

export default function CreateRequestDialogButton() {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Button variant="contained" size="large" onClick={handleOpen}>
				NEW REQUEST
			</Button>

			<Dialog
				open={open}
				onClose={handleClose}
				slotProps={{ paper: { sx: { maxWidth: '400px' } } }}
				fullWidth>
				<DialogTitle>Choose Request Type</DialogTitle>
				<DialogContent>
					<List component="nav" sx={{ gap: 1, p: 0 }}>
						<DesignRequestButton onCloseParent={handleClose} />
						<ProductionRequestButton onCloseParent={handleClose} />
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

const DesignRequestButton = ({ onCloseParent }: { onCloseParent: () => void }) => {
	const { user } = useAuth();
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [data, setData] = useState<DesignFormData>({ size: 'A4', theme: '', reference: [], description: '' });
	const [loading, setLoading] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSubmit = () => {
		if (loading || !user?.uid) return;
		setLoading(true);
		try {
			const c = collection(db, 'designs');
			console.log('Submitting Design Request:', data);
			addDoc(c, { ...data, createdAt: new Date(), updatedAt: new Date(), createdBy: user.uid, status: 'pending' })
				.then(() => {
					enqueueSnackbar('Design Request submitted successfully!', { variant: 'success' });
					setLoading(false);
					handleClose();
					onCloseParent();
				})
				.catch((error) => {
					console.error('Error submitting Design Request:', error);
					enqueueSnackbar('Failed to submit Design Request. Please try again.', { variant: 'error' });
					setLoading(false);
				})
		} catch (error) {
			console.error('Unexpected error submitting Design Request:', error);
			enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
			setLoading(false);
		}
	}

	useEffect(() => {

	}, [data]);


	return (
		<>
			<MenuItem
				onClick={() => {
					handleOpen();
					console.log('Design Request');
				}}
				sx={{ cursor: 'pointer' }}>
				<PaletteRounded />
				<Typography variant="body1" sx={{ ml: 1 }}>
					Design Request
				</Typography>
			</MenuItem>

			<Dialog
				open={open}
				onClose={handleClose}
				slotProps={{ paper: { sx: { maxWidth: '600px' } } }}
				fullWidth>
				<DialogTitle fontSize={24} fontWeight={800} py={2} pt={3}>DESIGN REQUEST</DialogTitle>
				<DialogContent sx={{ px: 4, mt: 1, overflow: 'visible' }}>
					<DesignForm data={data} onUpdate={setData} />
				</DialogContent>
				<DialogActions sx={{ px: 2 }}>
					<Button onClick={handleClose} color="primary" disabled={loading}>Cancel</Button>
					<Button
						disabled={loading}
						onClick={() => { handleSubmit(); }}
						variant='contained'
						type="submit"
						form="design-form"
						color="primary">Submit</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

const ProductionRequestButton = ({ onCloseParent }: { onCloseParent: () => void }) => {

	const { user } = useAuth();
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [data, setData] = useState<ProductionFormData>({ location: '', cluster: '', allocation: '', quantity: 1, designRef: '' });
	const [loading, setLoading] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSubmit = () => {
		if (loading || !user?.uid) return;
		setLoading(true);
		try {
			const c = collection(db, 'productions');
			console.log('Submitting Design Request:', data);
			addDoc(c, { ...data, createdAt: new Date(), updatedAt: new Date(), createdBy: user.uid, status: 'pending' })
				.then(() => {
					enqueueSnackbar('Design Request submitted successfully!', { variant: 'success' });
					setLoading(false);
					handleClose();
					onCloseParent();
				})
				.catch((error) => {
					console.error('Error submitting Design Request:', error);
					enqueueSnackbar('Failed to submit Design Request. Please try again.', { variant: 'error' });
					setLoading(false);
				})
		} catch (error) {
			console.error('Unexpected error submitting Design Request:', error);
			enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
			setLoading(false);
		}
	}

	return (
		<>
			<MenuItem
				onClick={() => {
					handleOpen();
					console.log('Production Request');
				}}
				sx={{ cursor: 'pointer' }}>
				<AdfScannerRounded />
				<Typography variant="body1" sx={{ ml: 1 }}>
					Production Request
				</Typography>
			</MenuItem>

			<Dialog
				open={open}
				onClose={handleClose}
				slotProps={{ paper: { sx: { maxWidth: '600px' } } }}
				fullWidth>
				<DialogTitle fontSize={24} fontWeight={800} py={2} pt={3}>PRODUCTION REQUEST</DialogTitle>
				<DialogContent sx={{ py: 1 }}>
					<ProductionForm data={data} onUpdate={setData} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" disabled={loading}>Cancel</Button>
					<Button
						disabled={loading}
						onClick={() => { handleSubmit(); }}
						variant='contained'
						type="submit"
						form="production-form"
						color="primary">Submit</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
