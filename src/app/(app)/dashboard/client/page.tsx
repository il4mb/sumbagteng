import ChatsListDialog from '@/componens/chats/ChatsListDialog';
import CreateRequestDialogButton from '@/componens/client/CreateRequestDialogButton';
import RequestGrid from '@/componens/client/RequestGrid';
import Header from '@/componens/ui/Header';
import ProfileAction from '@/componens/ui/ProfileAction';
import { Container, Stack } from '@mui/material';

export interface IAppProps {
}

export default function App(props: IAppProps) {
    return (
        <Container maxWidth="xl">
            <Header
                title='Dashboard'
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' }
                ]}
                actions={
                    <Stack direction="row" spacing={4} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ChatsListDialog />
                        </Stack>
                        <ProfileAction />
                    </Stack>
                } online />

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <CreateRequestDialogButton />
            </Stack>
            <RequestGrid />

        </Container>
    );
}
