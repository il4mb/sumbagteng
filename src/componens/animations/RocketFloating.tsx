'use client'
import { HTMLMotionProps, motion } from "framer-motion";
import { Box } from "@mui/material";

export default function RocketFloating(props: HTMLMotionProps<"div">) {
    return (
        <motion.div
            {...props}
            transition={{
                type: "spring",
                stiffness: 500, 
                damping: 30,
                duration: 300,
                ...props.transition,
            }}>
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
                    src="/rocket-launch.webp"
                    alt="Rocket"
                    sx={{ width: '100%', maxWidth: '400px' }} />
            </motion.div>
        </motion.div>
    );
}
