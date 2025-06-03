import ProfileManager from "@/componens/ProfileManager";
import Header from "@/componens/ui/Header";
import { Container } from "@mui/material";

export default function App() {
    return (
        <Container maxWidth="lg">
            <Header title="Profile" backbutton />
            <ProfileManager />
        </Container>
    );
}
