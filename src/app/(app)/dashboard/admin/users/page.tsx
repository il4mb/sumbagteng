"use server"

import UserListManager from "@/componens/admin/users/UserListManager";
import ChatsListDialog from "@/componens/chats/ChatsListDialog";
import Header from "@/componens/ui/Header";
import ProfileAction from "@/componens/ui/ProfileAction";
import { Container, Stack } from "@mui/material";

export default async function PageUsers() {
    return (
        <Container>
            <Header
                title='Users Manager'
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard/admin' },
                    { label: 'Users Manager', path: "/dashboard/admin/users" },
                ]}
                actions={
                    <Stack direction="row" spacing={4} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ChatsListDialog />
                        </Stack>
                        <ProfileAction />
                    </Stack>
                } online />

            <UserListManager />


        </Container>
    );
}
