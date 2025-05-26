'use client'

import { motion } from "framer-motion";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import "./animation.scss"

type Meteor = {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
    rotate: number;
};

const generateMeteors = (count: number): Meteor[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * count,
        duration: 15,
        size: 5 + Math.random() * 15,
        rotate: 35,
    }));
};

export default function MeteorFall() {
    const [meteors, setMeteors] = useState<Meteor[]>([]);

    useEffect(() => {
        setMeteors(generateMeteors(10));
    }, []);

    return (
        <Box sx={containerStyle}>
            {meteors.map((meteor) => {
                const gradientId = `gradient-${meteor.id}`;
                const angleRad = ((meteor.rotate + 90) * Math.PI) / 180;
                const distance = window.innerHeight + 300;
                const dx = Math.cos(angleRad) * distance;
                const dy = Math.sin(angleRad) * distance;

                return (
                    <motion.div
                        key={meteor.id}
                        initial={{
                            x: meteor.x,
                            y: -800,
                            rotate: meteor.rotate,
                            opacity: 1,
                        }}
                        animate={{
                            x: meteor.x + dx,
                            y: -meteor.size * 4 + dy,
                            opacity: 0,
                        }}
                        transition={{
                            duration: meteor.duration,
                            delay: meteor.delay,
                            repeat: Infinity,
                            repeatDelay: 3 + Math.random() * 3,
                            ease: "easeInOut",
                        }}
                        style={{
                            position: 'relative',
                            width: meteor.size,
                            height: meteor.size * 3.8
                        }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12.146676 30.439547"
                            width={meteor.size}
                            height={meteor.size * 3.8}>
                            <defs>
                                <linearGradient id={gradientId} x1="100%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#e64e4e12" />
                                    <stop offset="20%" stopColor="#e64e4e35" />
                                    <stop offset="50%" stopColor="#e64e4e99" />
                                    <stop offset="100%" stopColor="#e64e4e" />
                                </linearGradient>
                            </defs>
                            <path
                                fill={`url(#${gradientId})`}
                                d="M 6.132,-4.063 A 0.355,0.355 0 0 0 5.782,-3.763 L 0.933,27.402 h 0.006 a 5.424,5.424 0 0 0 -0.231,1.557 5.424,5.424 0 0 0 5.424,5.424 5.424,5.424 0 0 0 5.424,-5.424 5.424,5.424 0 0 0 -0.243,-1.602 L 6.482,-3.763 A 0.355,0.355 0 0 0 6.132,-4.063 Z"
                            />
                        </svg>
                        {meteor.size > 10 && (
                            <Box sx={{
                                position: 'absolute',
                                bottom: '7.5px',
                                left: '2.5px',
                                background: 'linear-gradient(0deg, #f53d3d, gray)',
                                width: meteor.size - 5,
                                height: meteor.size - 5,
                                borderRadius: meteor.size - 7.5,
                            }} />
                        )}
                    </motion.div>
                );
            })}

        </Box>
    );
}

const containerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none",
};