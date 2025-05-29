import AuthProvider from "@/componens/AuthProvider";
import ChatProvider from "@/componens/chats/ChatProvider";
import NotificationRegister from "@/componens/NotificationRegister";
import { Box } from "@mui/material";

export interface Props {
    children?: React.ReactNode;
}

export default function Layout(props: Props) {
    return (
        <NotificationRegister>
            <AuthProvider>
                <ChatProvider>
                    <Box sx={{ pt: 8 }}>{props.children}</Box>
                </ChatProvider>
            </AuthProvider>
        </NotificationRegister>
    );
}
