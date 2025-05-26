'use client'
import Navbar from "@/componens/ui/Navbar";
import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";

type Props = {
	children?: React.ReactNode;
};

export default function AppLayout({ children }: Props) {

	return (
		<>
			<Navbar />
			<Box sx={{ pt: 12 }}>
				<AnimatePresence mode="wait">
					{children}
				</AnimatePresence>
			</Box>
		</>
	);
}
