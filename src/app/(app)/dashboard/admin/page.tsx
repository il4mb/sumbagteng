import PendingRequest from '@/componens/admin/PendingRequest';
import ChatsListDialog from '@/componens/chats/ChatsListDialog';
import { StyledCardLink } from '@/componens/styled';
import Header from '@/componens/ui/Header';
import ProfileAction from '@/componens/ui/ProfileAction';
import { SettingsRounded, SupervisedUserCircle } from '@mui/icons-material';
import { Avatar, Box, Container, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

export default function App() {
    return (
        <Container maxWidth="xl">
            <Header
                title='Dashboard'
                breadcrumbs={[
                    { label: 'Home', path: '/' }
                ]}
                actions={
                    <Stack direction="row" spacing={4} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Tooltip title="Settings">
                                <IconButton LinkComponent={Link} href='/dashboard/admin/settings'>
                                    <SettingsRounded />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Users Manager">
                                <IconButton LinkComponent={Link} href='/dashboard/admin/users'>
                                    <SupervisedUserCircle />
                                </IconButton>
                            </Tooltip>
                            <ChatsListDialog />
                        </Stack>
                        <ProfileAction />
                    </Stack>
                } online />

            <Grid container spacing={2} sx={{ mt: 8 }}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
                    <StyledCardLink href={"/dashboard/designs"}>
                        <Avatar
                            src="/002-color-palette.png"
                            sx={{ width: 100, height: 100 }}
                        />
                        <Typography fontSize={22} fontWeight={600}>
                            Design
                        </Typography>
                    </StyledCardLink>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
                    <StyledCardLink href={"/dashboard/productions"}>
                        <Avatar
                            src="/001-printer.png"
                            sx={{ width: 100, height: 100 }}
                        />
                        <Typography fontSize={22} fontWeight={600}>
                            Production
                        </Typography>
                    </StyledCardLink>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <PendingRequest />
            </Box>
        </Container>
    );
}