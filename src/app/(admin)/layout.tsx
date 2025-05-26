import * as React from 'react';

export interface IAdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: IAdminLayoutProps) {
    return (
        <div>
            {children}
        </div>
    );
}
