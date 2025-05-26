"use client"
import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { gray, brand, red } from "../themePrimitives";
import { blue } from "@mui/material/colors";

export const inputsCustomizations: Components<Theme> = {
    MuiButtonBase: {
        defaultProps: {
            disableTouchRipple: true,
            disableRipple: true
        },
        styleOverrides: {
            root: ({ theme }) => ({
                boxSizing: "border-box",
                transition: "all 100ms ease-in",
                borderRadius: theme.shape.borderRadius,
                "&:focus-visible": {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: "2px",
                },
            }),
        },
    },
    MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: "none",
                textTransform: "none",
                borderRadius: theme.shape.borderRadius,
                variants: [
                    {
                        props: {
                            size: "small",
                        },
                        style: {
                            height: "1.8rem",
                            padding: "8px 12px",
                            fontSize: "0.75rem",
                        },
                    },
                    {
                        props: {
                            size: "medium",
                        },
                        style: {
                            height: "2rem",
                        },
                    },
                    {
                        props: {
                            color: "primary",
                            variant: "contained",
                        },
                        style: {
                            color: "white",
                            backgroundColor: blue[800],
                            border: `1px solid`,
                            borderColor: 'transparent',
                            "&:hover": {
                                backgroundImage: "none",
                                backgroundColor: blue[700],
                            },
                            "&:active": {
                                backgroundColor: blue[800],
                            },
                            ...theme.applyStyles("dark", {
                                backgroundColor: blue[600]
                            }),
                        },
                    },
                    {
                        props: {
                            color: "secondary",
                            variant: "contained",
                        },
                        style: {
                            color: "white",
                            backgroundColor: gray[600],
                            border: `1px solid ${gray[900]}`,
                            "&:hover": {
                                backgroundImage: "none",
                                backgroundColor: gray[700],
                            },
                            "&:active": {
                                backgroundColor: gray[800]
                            },
                            ...theme.applyStyles("dark", {
                                backgroundColor: gray[700],
                                borderColor: gray[400],
                            }),
                        },
                    },

                    {
                        props: {
                            variant: "outlined",
                        },
                        style: {
                            color: theme.palette.text.primary,
                            border: "1px solid blue",
                            borderColor: blue[400],
                            borderWidth: 1,
                            borderStyle: "solid",
                            backgroundColor: alpha(blue[50], 0),
                            "&:hover": {
                                backgroundColor: blue[700],
                                borderColor: blue[900],
                                color: "white",
                            },
                            "&:active": {
                                backgroundColor: blue[700],
                            },
                            ...theme.applyStyles("dark", {
                                // backgroundColor: blue[800],
                                borderColor: blue[600],

                                "&:hover": {
                                    backgroundColor: blue[700],
                                    borderColor: blue[600],
                                },
                                "&:active": {
                                    backgroundColor: blue[700],
                                },
                            }),
                        },
                    },
                    {
                        props: {
                            color: "secondary",
                            variant: "outlined",
                        },
                        style: {
                            color: gray[700],
                            border: "1px solid",
                            borderColor: gray[400],
                            backgroundColor: gray[50],
                            "&:hover": {
                                backgroundColor: gray[500],
                                borderColor: gray[400],
                            },
                            "&:active": {
                                backgroundColor: alpha(gray[200], 0.7),
                            },
                            ...theme.applyStyles("dark", {
                                color: gray[50],
                                border: "1px solid",
                                borderColor: gray[900],
                                backgroundColor: alpha(gray[900], 0.3),
                                "&:hover": {
                                    borderColor: gray[700],
                                    backgroundColor: alpha(gray[900], 0.6),
                                },
                                "&:active": {
                                    backgroundColor: alpha(gray[900], 0.5),
                                },
                            }),
                        },
                    },
                    {
                        props: {
                            variant: "outlined",
                            color: "error"
                        },
                        style: {
                            borderColor: red[400],
                            color: red[400],
                            "&:hover": {
                                backgroundColor: red[400],
                                borderColor: red[400],
                            },
                            "&:active": {
                                backgroundColor: alpha(red[200], 0.7),
                            },
                            ...theme.applyStyles("dark", {
                                borderColor: red[600],
                                "&:hover": {
                                    borderColor: red[700],
                                    backgroundColor: red[600],
                                },
                                "&:active": {
                                    backgroundColor: alpha(red[900], 0.5),
                                    color: "white"
                                },
                            }),
                        },
                    },
                    {
                        props: {
                            variant: "text",
                        },
                        style: {
                            color: gray[600],
                            "&:hover": {
                                backgroundColor: gray[100],
                            },
                            "&:active": {
                                backgroundColor: gray[200],
                            },
                            ...theme.applyStyles("dark", {
                                color: gray[50],
                                "&:hover": {
                                    backgroundColor: gray[700],
                                },
                                "&:active": {
                                    backgroundColor: alpha(gray[700], 0.7),
                                },
                            }),
                        },
                    },
                    {
                        props: {
                            color: "secondary",
                            variant: "text",
                        },
                        style: {
                            color: brand[700],
                            "&:hover": {
                                backgroundColor: alpha(brand[100], 0.5),
                            },
                            "&:active": {
                                backgroundColor: alpha(brand[200], 0.7),
                            },
                            ...theme.applyStyles("dark", {
                                color: brand[100],
                                "&:hover": {
                                    backgroundColor: alpha(brand[900], 0.5),
                                },
                                "&:active": {
                                    backgroundColor: alpha(brand[900], 0.3),
                                },
                            }),
                        },
                    },
                ],
            }),
        },
    },
    MuiIconButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                boxShadow: "none",
                borderRadius: theme.shape.borderRadius,
                textTransform: "none",
                fontWeight: theme.typography.fontWeightMedium,
                letterSpacing: 0,
                color: "#000",
                border: "1px solid ",
                borderColor: 'transparent',
                backgroundColor: alpha(gray[50], 0.2),
                minWidth: 0,
                padding: 0,
                width: '2rem !important',
                height: '2rem !important',
                "& > *": {
                    fontSize: '16px'
                },
                "&:hover": {
                    backgroundColor: gray[100],
                    borderColor: 'transparent',
                },
                "&:active": {
                    backgroundColor: gray[200],
                },
                ...theme.applyStyles("dark", {
                    backgroundColor: alpha(gray[800], 0.2),
                    color: gray[100],
                    "&:hover": {
                        backgroundColor: gray[900],
                    },
                    "&:active": {
                        backgroundColor: gray[900],
                    },
                }),
                variants: [
                    {
                        props: {
                            size: "small",
                        },
                        style: {
                            width: "2.25rem",
                            height: "2.25rem",
                            padding: "0.25rem",
                            [`& .${svgIconClasses.root}`]: { fontSize: "1rem" },
                        },
                    },
                    {
                        props: {
                            size: "medium",
                        },
                        style: {
                            width: "2.5rem",
                            height: "2.5rem",
                        },
                    },
                ],
            }),
        },
    },
    MuiToggleButtonGroup: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: "10px",
                boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
                [`& .${toggleButtonGroupClasses.selected}`]: {
                    color: brand[500],
                },
                ...theme.applyStyles("dark", {
                    [`& .${toggleButtonGroupClasses.selected}`]: {
                        color: "#fff",
                    },
                    boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
                }),
            }),
        },
    },
    MuiToggleButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: "12px 16px",
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 500,
                ...theme.applyStyles("dark", {
                    color: gray[400],
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
                    [`&.${toggleButtonClasses.selected}`]: {
                        color: brand[300],
                    },
                }),
            }),
        },
    },
    MuiCheckbox: {
        defaultProps: {
            disableRipple: true,
            icon: (
                <CheckBoxOutlineBlankRoundedIcon sx={{ color: "hsla(210, 0%, 0%, 0.0)" }} />
            ),
            checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
            indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
        },
        styleOverrides: {
            root: ({ theme }) => ({
                margin: 10,
                height: 16,
                width: 16,
                borderRadius: theme.shape.borderRadius,
                border: "1px solid ",
                borderColor: alpha(gray[300], 0.8),
                boxShadow: "0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset",
                backgroundColor: alpha(gray[100], 0.4),
                transition: "border-color, background-color, 120ms ease-in",
                "&:hover": {
                    borderColor: brand[300],
                },
                "&.Mui-focusVisible": {
                    outline: `3px solid ${alpha(brand[500], 0.5)}`,
                    outlineOffset: "2px",
                    borderColor: brand[400],
                },
                "&.Mui-checked": {
                    color: "white",
                    backgroundColor: brand[500],
                    borderColor: brand[500],
                    boxShadow: `none`,
                    "&:hover": {
                        backgroundColor: brand[600],
                    },
                },
                ...theme.applyStyles("dark", {
                    borderColor: alpha(gray[700], 0.8),
                    boxShadow: "0 0 0 1.5px hsl(210, 0%, 0%) inset",
                    backgroundColor: alpha(gray[900], 0.8),
                    "&:hover": {
                        borderColor: brand[300],
                    },
                    "&.Mui-focusVisible": {
                        borderColor: brand[400],
                        outline: `3px solid ${alpha(brand[500], 0.5)}`,
                        outlineOffset: "2px",
                    },
                }),
            }),
        },
    },

    MuiFormControl: {
        styleOverrides: {
            root: ({ theme }) => ({
                "& .MuiFormLabel-root": {
                    top: "50%",
                    transform: "translate(14px, -50%)",
                    transition: 'all 0.2s ease'
                },
                "&:has(.Mui-focused), &:has(.MuiFormLabel-filled)": {
                    "& .MuiFormLabel-root": {
                        top: 0,
                        transform: "translate(14px, -50%) scale(0.758)",
                        ...theme.applyStyles("dark", {
                            color: "white"
                        })
                    }
                }
            })
        }
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                border: "none",
            },
            input: ({ theme }) => ({
                color: "#000",
                "&::placeholder": {
                    opacity: 0.7,
                },
                ...theme.applyStyles("dark", {
                    color: "#fff",
                    "&::placeholder": {
                        opacity: 0.6,
                        color: "white",
                    },
                }),
            }),
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: 0,
            },
            root: ({ theme, ownerState }) => {

                const { multiline, size } = ownerState;

                return {
                    padding: "8px 12px",
                    color: theme.palette.text.primary,
                    borderRadius: theme.shape.borderRadius,
                    transition: "border 120ms ease-in",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: blue[800],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: blue[800],
                    },
                    ...(multiline && {
                        textAlign: 'left',
                        verticalAlign: 'top'
                    }),
                    ...theme.applyStyles("dark", {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: blue[400],
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: blue[400],
                            color: "white"
                        },
                    }),
                    variants: [
                        {
                            props: {
                                size: "small",
                            },
                            style: {
                                height: multiline ? "unset" : "2rem",
                            },
                        },
                        {
                            props: {
                                size: "medium",
                            },
                            style: {
                                height: multiline ? "unset" : "2.5rem",
                            },
                        },
                    ],
                }
            },
            notchedOutline: ({ theme }) => ({
                border: `1px solid`,
                transition: "border 120ms ease-in",
                borderColor: gray[500],
                ...theme.applyStyles("dark", {
                    borderColor: gray[400],
                }),
            }),
        },
    },

    MuiInputAdornment: {
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.grey[500],
                ...theme.applyStyles("dark", {
                    color: theme.palette.grey[400],
                }),
            }),
        },
    },

    MuiFormLabel: {
        styleOverrides: {
            root: ({ theme }) => ({
                typography: theme.typography.caption,
                transform: "translate(14px, 0px)",
                transition: "color 120ms ease-in",
                color: theme.palette.text.secondary,
                "&.Mui-focused": {
                    color: gray[800],
                },
            }),
        },
    },

    MuiSelect: {
        styleOverrides: {
            root: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                border: `0px solid`,
                transition: "border 120ms ease-in",
                "&:hover": {
                    borderColor: gray[800],
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: gray[800],
                    }
                },
                variants: [
                    {
                        props: {
                            size: "small",
                        },
                        style: {
                            height: "2.25rem",
                        },
                    },
                ],
            })
        }
    }
};