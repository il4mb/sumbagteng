import PendingRequest from '@/componens/admin/PendingRequest';
import ChatsListDialog from '@/componens/chats/ChatsListDialog';
import { StyledCardLink } from '@/componens/styled';
import Header from '@/componens/ui/Header';
import ProfileAction from '@/componens/ui/ProfileAction';
import { Avatar, Box, Container, Grid, Stack, styled, Typography } from '@mui/material';

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