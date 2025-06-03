'use client'

import { UploadFile } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useRef } from "react";

export interface IAppProps {
    onPick?: (file: File) => void;
    accept?: string; // optional: e.g. "image/*"
}

export default function ImagePickerButton(props: IAppProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && props.onPick) {
            props.onPick(file);
        }
        e.target.value = ""; // allow re-pick of same file
    };

    return (
        <>
            <input
                type="file"
                hidden
                ref={inputRef}
                onChange={handleChange}
                accept={props.accept}
            />
            <Tooltip title="Upload file">
                <IconButton onClick={handleClick}>
                    <UploadFile />
                </IconButton>
            </Tooltip>
        </>
    );
}
