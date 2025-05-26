import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

type Props = {}

export default function HubungiKamiPage({ }: Props) {
	return (
		<Container maxWidth="sm" sx={{ mt: 12 }} color='#fff'>
			<Box textAlign="center" mb={6} color='#fff'>
				<ContactSupportIcon color="primary" sx={{ fontSize: 48 }} />
				<Typography variant="h4" fontWeight="bold" gutterBottom>
					Hubungi Kami
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Ada pertanyaan atau butuh bantuan? Kirimkan pesan kepada kami dan tim kami akan segera merespon.
				</Typography>
			</Box>

			<Box component="form" noValidate autoComplete="off">
				<Grid container spacing={3}>
					<Grid size={{ xs: 12 }}>
						<TextField
							fullWidth
							required
							label="Nama Lengkap"
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12 }}>
						<TextField
							fullWidth
							required
							label="Email"
							type="email"
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12 }}>
						<TextField
							fullWidth
							required
							label="Pesan"
							multiline
							rows={4}
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12 }}>
						<Button fullWidth variant="contained" size="large">
							Kirim Pesan
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
