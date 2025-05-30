"use client"

import { ChatRounded } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import * as React from 'react';
import { useChat } from './ChatProvider';

export interface IChatButtonProps {
    designId: string;
}

export default function ChatButton({ designId }: IChatButtonProps) {

    const { openChatWindow } = useChat();

    return (
        <>
            <Tooltip title={`Open chat ID: ${designId}`} arrow>
                <IconButton onClick={() => openChatWindow(designId)}>
                    <ChatRounded />
                </IconButton>
            </Tooltip>
        </>
    );
}
