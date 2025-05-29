import NotificationRegister from "@/componens/NotificationRegister";

export interface Props {
    children?: React.ReactNode;
}

export default function Layout(props: Props) {
    return (
        <NotificationRegister>
            {props.children}
        </NotificationRegister>
    );
}
