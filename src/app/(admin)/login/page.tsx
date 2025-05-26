'use client'
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Checkbox,
    FormControlLabel,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthContainer = styled(motion.div)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 450,
    margin: '0 auto',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: "#00000055",
    boxShadow: theme.shadows[10],
}));

const FormContainer = styled('form')({
    width: '100%',
    marginTop: 2,
});

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const auth = getAuth(app);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(getFirebaseError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const getFirebaseError = (code: string) => {
        switch (code) {
            case 'auth/invalid-email': return 'Invalid email address';
            case 'auth/user-disabled': return 'Account disabled';
            case 'auth/user-not-found': return 'No account found with this email';
            case 'auth/wrong-password': return 'Incorrect password';
            case 'auth/too-many-requests': return 'Too many attempts. Try again later';
            default: return 'Login failed. Please try again';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}>
            <AuthContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography color="text.secondary" align="center" mb={4}>
                        Sign in to your account
                    </Typography>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ width: '100%' }}>
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    </motion.div>
                )}

                <FormContainer onSubmit={handleLogin}>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                            <Link href="/forgot-password" variant="body2" color='text.primary'>
                                Forgot password?
                            </Link>
                        </Box>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 2, mb: 3, py: 1.5 }}>
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </motion.div>
                </FormContainer>
            </AuthContainer>
        </Box>
    );
}