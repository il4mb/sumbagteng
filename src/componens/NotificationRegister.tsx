'use client'
import { SnackbarProvider } from 'notistack';

export interface Props {
    children?: React.ReactNode;
}

export default function NotificationRegister(props: Props) {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={3000} preventDuplicate anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {props.children}
        </SnackbarProvider>
    );
}
