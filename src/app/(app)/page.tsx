
import MeteorFallDown from '@/componens/animations/MeteorFallDown';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import FiturPage from "./fitur/page";
import RocketFloating from '@/componens/animations/RocketFloating';

export default function HomePage() {
    return (
        <Box>
            <Box sx={{ pt: 18, minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
                <Container sx={{ position: 'relative', zIndex: 4, }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        {/* Left Text Content */}
                        <Box sx={{ flex: 1, maxWidth: '500px' }}>
                            <Typography variant="h3" gutterBottom sx={{ letterSpacing: 5, fontWeight: 900, color: '#ff6a00', fontSize: { md: 60, sm: 60, xs: 38 } }}>
                                ROCKET SUMBAGTENG
                            </Typography>
                            <Typography variant="subtitle1" color='#fff' gutterBottom>
                                REQUEST ORDER CENTER
                                <br />
                                MAKETING SUPPORT
                            </Typography>
                            <Button variant="contained"
                                size="large"
                                sx={{
                                    background: 'linear-gradient(to right, #ff6a00, #ee0979)',
                                    color: '#fff',
                                    px: 8,
                                    py: 1.5,
                                    mt: 2,
                                    borderRadius: '50px',
                                    fontSize: 22
                                }}>
                                Get Started
                            </Button>
                        </Box>

                        {/* Right Image */}
                        <Box sx={{ flex: 1, textAlign: 'center', mt: { xs: 4, md: 0 } }}>
                            <RocketFloating layoutId="shared-box" />
                        </Box>
                    </Stack>
                </Container>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: '250px',
                        background: 'linear-gradient(to top, #5e0acc, #d138ff)',
                        clipPath: 'ellipse(100% 100% at 50% 100%)',
                        zIndex: 3,
                    }}
                />
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0
                }}>
                    <MeteorFallDown />
                </Box>
            </Box>
            <Box sx={{ background: '#5e0acc', m: -12, position: 'relative', zIndex: 1, pb: 12 }}>
                <Container sx={{ mt: 12 }}>
                    <FiturPage />
                </Container>
            </Box>
        </Box>
    );
};