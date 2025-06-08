"use server"

import BranchManager from "@/componens/admin/settings/BranchManager";
import DesignTypeManager from "@/componens/admin/settings/DesignTypeManager";
import ThemeManager from "@/componens/admin/settings/ThemeManager";
import Header from "@/componens/ui/Header";
import { Box, Container } from "@mui/material";

export default async function PageUsers() {
    return (
        <Container>
            <Header
                title='Settings'
                breadcrumbs={[
                    { label: 'Home', path: '/dashboard/admin' },
                    { label: 'Settings', path: "/dashboard/admin/settings" },
                ]} />

            <BranchManager />

            <Box sx={{ mt: 4 }}>
                <DesignTypeManager />
            </Box>
            
            <Box sx={{ mt: 4 }}>
                <ThemeManager />
            </Box>


        </Container>
    );
}
