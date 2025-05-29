'use client'
import { Box, Button, Container, Grid, Typography, useTheme } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import RocketFloating from "@/componens/animations/RocketFloating";

type Feature = {
	icon: React.ReactElement;
	title: string;
	description: string;
};

const features: Feature[] = [
	{
		icon: <RocketLaunchIcon fontSize="large" color="primary" />,
		title: "Cepat & Andal",
		description: "Performa tinggi tanpa hambatan. Nikmati pengalaman instan tanpa loading yang lama."
	},
	{
		icon: <AutoAwesomeIcon fontSize="large" color="primary" />,
		title: "Desain Modern",
		description: "Tampilan elegan dan user-friendly yang dirancang untuk kenyamanan pengguna."
	},
	{
		icon: <SecurityIcon fontSize="large" color="primary" />,
		title: "Aman & Terpercaya",
		description: "Keamanan data terjamin dengan standar enkripsi tingkat tinggi."
	}
];

export default function FiturPage() {
	const theme = useTheme();

	return (
		<Container maxWidth="md" sx={{ mt: 12 }}>

			{/* Hero Section */}
			<Box textAlign="center" mb={8} color='#fff'>
				<Typography variant="h3" fontWeight="bold" gutterBottom>
					Jelajahi Fitur Unggulan Kami
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" maxWidth="sm" mx="auto">
					Kami menghadirkan solusi terbaik yang dirancang untuk memudahkan hidup Anda.
				</Typography>
				<Button variant="contained" size="large" sx={{ mt: 4 }}>
					Mulai Sekarang
				</Button>
			</Box>


			{/* Feature Grid */}
			<Grid container spacing={4}>
				{features.map((feature, index) => (
					<Grid size={{ sm: 12, md: 6, lg: 4 }} key={index} color='#fff'>
						<Box textAlign="center" px={2}>
							{feature.icon}
							<Typography variant="h6" fontWeight="bold" mt={2}>
								{feature.title}
							</Typography>
							<Typography variant="body2" color="text.secondary" mt={1}>
								{feature.description}
							</Typography>
						</Box>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}
