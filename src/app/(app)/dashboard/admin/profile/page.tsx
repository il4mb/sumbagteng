import Header from "@/componens/ui/Header";
import { Container } from "@mui/material";

export interface IAppProps {
}

export default function App(props: IAppProps) {
    return (
        <Container maxWidth="lg">
            <Header title="Profile" backbutton/>
        </Container>
    );
}
