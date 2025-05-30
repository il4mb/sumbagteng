import GridDesign from '@/componens/admin/designs/GridDesign';
import ChatsListDialog from '@/componens/chats/ChatsListDialog';
import Header from '@/componens/ui/Header';
import ProfileAction from '@/componens/ui/ProfileAction';
import { Container, Stack } from '@mui/material';

export default async function DesignPage() {
    return (
        <Container maxWidth="xl">
            <Header
                title='Designs'
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Designs', path: '/dashboard/designs' },
                ]}
                actions={
                    <Stack direction="row" spacing={4} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ChatsListDialog />
                        </Stack>
                        <ProfileAction />
                    </Stack>
                } online />

            <GridDesign />
        </Container>
    );
}
