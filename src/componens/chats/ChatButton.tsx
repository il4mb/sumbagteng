"use client"

import { ChatRounded } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import * as React from 'react';
import { MappedRequest } from '../client/RequestGrid';

export interface IChatButtonProps {
    row: MappedRequest;
}

export default function ChatButton(props: IChatButtonProps) {
    const { row } = props;

    return (
        <>
            <Tooltip title={`Chat with ${row.type} request ID: ${row.id}`} arrow>
                <IconButton>
                    <ChatRounded />
                </IconButton>
            </Tooltip>
        </>
    );
}
