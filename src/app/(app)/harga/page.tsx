import RocketFloating from "@/componens/animations/RocketFloating";
import { Box, Card, CardContent, Container, Grid, Typography, Button } from "@mui/material";

type Props = {}

const pricingPlans = [
	{
		title: "Basic",
		price: "Gratis",
		features: ["1 Pengguna", "Akses Terbatas", "Support Email"],
		buttonText: "Mulai Sekarang",
	},
	{
		title: "Pro",
		price: "Rp49.000/bulan",
		features: ["5 Pengguna", "Semua Fitur Dasar", "Support Prioritas"],
		buttonText: "Pilih Paket Ini",
	},
	{
		title: "Premium",
		price: "Rp99.000/bulan",
		features: ["Tanpa Batas Pengguna", "Fitur Lengkap", "Support 24/7"],
		buttonText: "Paket Terbaik",
	},
];

export default function HargaPage({ }: Props) {
	return (
		<Container maxWidth="md" sx={{ mt: 20 }}>

			<Box sx={{ position: 'relative', mt: 12 }}>
				<RocketFloating
					layoutId="shared-box"
					initial={{
						rotate: -90,
						scale: 0.5,
						position: 'absolute',
						bottom: '-140%',
						right: '-50px'
						// left: '100%'
					}} />

				<Box textAlign="center" mb={6} color='#fff'>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Pilih Paket yang Sesuai
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Transparan, fleksibel, dan terjangkau. Tanpa biaya tersembunyi.
					</Typography>
				</Box>
			</Box>

			<Grid container spacing={4}>
				{pricingPlans.map((plan, index) => (
					<Grid size={{ xs: 12, sm: 4 }} key={index}>
						<Card
							variant="outlined"
							sx={{ textAlign: "center", height: "100%", p: 2, borderRadius: 4 }}>
							<CardContent>
								<Typography variant="h6" fontWeight="bold" gutterBottom>
									{plan.title}
								</Typography>
								<Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
									{plan.price}
								</Typography>
								<Box component="ul" sx={{ textAlign: "left", listStyle: "none", p: 0, mb: 2 }}>
									{plan.features.map((feature, i) => (
										<li key={i}>
											<Typography variant="body2">• {feature}</Typography>
										</li>
									))}
								</Box>
								<Button variant="contained" fullWidth>
									{plan.buttonText}
								</Button>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}
