"use client"
import { styled } from '@mui/material';
import Link from 'next/link';

export const StyledCardLink = styled(Link)({
    margin: "0 auto",
    borderRadius: '1.4rem',
    background: "linear-gradient(135deg, #ffffff22, #ffffff44)",
    backdropFilter: 'blur(10px)',
    padding: '2rem 4rem',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    minWidth: '400px',
    textDecoration: 'none',
    color: 'inherit',

    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        background: "linear-gradient(135deg,rgba(172, 199, 240, 0.66),rgba(85, 11, 114, 0.68))",
    }
})