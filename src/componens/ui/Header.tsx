import { Box, Stack, Typography, Breadcrumbs, Link, IconButton } from '@mui/material';
import * as React from 'react';
import NextLink from 'next/link';
import WhoseOnline from './WhoseOnline';
import { West, WestRounded } from '@mui/icons-material';

export interface IHeaderProps {
    title: string;
    breadcrumbs?: { label: string; path: string }[];
    actions?: React.ReactNode;
    online?: boolean;
    backbutton?: boolean;
}

export default function Header(props: IHeaderProps) {

    return (
        <Box sx={{ mb: 4 }}>
            {/* Title and Actions */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {props.backbutton && (
                        <IconButton
                            LinkComponent={NextLink}
                            href="."
                            color="primary"
                            sx={{ width: 50, height: 50, fontSize: 30 }}>
                            <WestRounded />
                        </IconButton>
                    )}
                    <Typography variant="h1" fontWeight="bold">
                        {props.title}
                    </Typography>
                </Stack>

                {props.actions && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {props.actions}
                    </Box>
                )}
            </Stack>

            {/* Breadcrumbs */}
            {props.breadcrumbs && props.breadcrumbs.length > 0 && (
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                    {props.breadcrumbs.map((breadcrumb, index) => {
                        const isLast = index === props.breadcrumbs!.length - 1;

                        return isLast ? (
                            <Typography key={breadcrumb.path} color="text.primary">
                                {breadcrumb.label}
                            </Typography>
                        ) : (
                            <Link
                                key={breadcrumb.path}
                                component={NextLink}
                                href={breadcrumb.path}
                                color="inherit"
                                underline="hover"
                            >
                                {breadcrumb.label}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            )}
            {/* Online Status */}
            {props.online && (
                <Box sx={{ mt: 1 }}>
                    <WhoseOnline />
                </Box>
            )}
        </Box>
    );
}