'use client'
import { motion } from "framer-motion";
import { Box } from "@mui/material";

export default function FloatingImage() {
    return (
        <motion.div
            animate={{
                y: [0, -40, 0],
                x: [0, 40, 0],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}>
            <Box
                component="img"
                src="/assets/rocket-launch.png"
                alt="Rocket"
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                }}
            />
        </motion.div>
    );
}
