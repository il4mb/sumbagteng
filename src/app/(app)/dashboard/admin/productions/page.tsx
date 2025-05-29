import Header from '@/componens/ui/Header';
import ProfileAction from '@/componens/ui/ProfileAction';
import { Container } from '@mui/material';

export default function DesignPage() {
    return (
        <Container maxWidth="xl">
            <Header
                title='Productions'
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Productions', path: '/dashboard/productions' },
                ]}
                actions={<ProfileAction />} />
        </Container>
    );
}
