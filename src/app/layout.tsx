import React from 'react'
import AppTheme from "@/theme/AppTheme";

type Props = {
    children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="ID-id">
            <body>
                <AppTheme>
                    {children}
                </AppTheme>
            </body>
        </html>
    )
}