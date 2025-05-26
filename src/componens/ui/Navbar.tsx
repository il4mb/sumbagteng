'use client'
import { RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, IconButton, SxProps, Toolbar } from "@mui/material";
import { blue } from "@mui/material/colors";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


type Props = {}

export default function Navbar({ }: Props) {
	const router = useRouter();
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	return (
		<Box
			component="header"
			position="fixed"
			sx={{
				background: '#00000022',
				boxShadow: 'none',
				pt: 2,
				pb: 1,
				top: 0,
				px: 2,
				width: '100%',
				zIndex: 999,
				backdropFilter: 'blur(25px)',
			}}>
			<Toolbar sx={{ justifyContent: 'space-between', background: 'transparent' }}>
				<IconButton edge="start" color="inherit" aria-label="menu" onClick={() => router.push('/')}>
					<RocketLaunchRounded />
				</IconButton>
				<Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
					{navLinks.map(({ href, label }) => (
						<Box
							key={href}
							component={Link}
							href={href}
							sx={{
								...linkStyle,
								color: isActive(href) ? blue[500] : '#fff',
								textDecoration: isActive(href) ? 'underline' : 'none',
							}}>
							{label}
						</Box>
					))}
					<Button LinkComponent={Link} href={'/login'} variant="contained" color="primary">Login</Button>
				</Box>
			</Toolbar>
		</Box>
	);
}

const navLinks = [
	{ href: '/', label: 'Beranda' },
	{ href: '/fitur', label: 'Fitur' },
	{ href: '/hubungi-kami', label: 'Hubungi Kami' },
];

const linkStyle: SxProps = {
	fontWeight: 600,
	textDecoration: 'none',
	cursor: 'pointer',
	"&:hover": {
		color: blue[600],
		textDecoration: 'underline',
	},
};
