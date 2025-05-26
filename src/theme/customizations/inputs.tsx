'use client'
import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { gray, brand, colorSchemes } from "../themePrimitives";
import { red, yellow } from "@mui/material/colors";
import { BorderColor } from "@mui/icons-material";

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
                            padding: "8px 18px",
                            fontSize: "0.75rem",
                            "&:hover": {
                                color: 'white',
                            }
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
                            background: red[600],
                            border: `1px solid ${red[400]}`,
                            "&:hover": {
                                backgroundImage: "none",
                                background: red[400],
                            },
                            "&:active": {
                                background: red[600],
                            },
                            ...theme.applyStyles("dark", {
                                background: red[600],
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
                            background: gray[600],
                            border: `1px solid ${gray[500]}`,
                            "&:hover": {
                                backgroundImage: "none",
                                background: gray[700],
                            },
                            "&:active": {
                                background: gray[800],
                            },
                        },
                    },
                    {
                        props: {
                            color: "warning",
                            variant: "outlined",
                        },
                        style: {
                            color: yellow[700],
                            border: "1px solid",
                            borderColor: yellow[400],
                            backgroundColor: yellow[50],
                            "&:hover": {
                                backgroundColor: yellow[500],
                                borderColor: yellow[400],
                                color: "white",
                            },
                            "&:active": {
                                backgroundColor: alpha(yellow[200], 0.7),
                                color: "white",
                            },
                            ...theme.applyStyles("dark", {
                                color: yellow[50],
                                border: "1px solid",
                                borderColor: yellow[900],
                                backgroundColor: alpha(yellow[900], 0.3),
                                "&:hover": {
                                    borderColor: yellow[700],
                                    backgroundColor: alpha(yellow[900], 0.6),
                                    color: "white",
                                },
                                "&:active": {
                                    backgroundColor: alpha(yellow[900], 0.5),
                                    color: "white",
                                },
                            }),
                        }
                    },

                    {
                        props: {
                            variant: "outlined",
                        },
                        style: {
                            color: theme.palette.text.primary,
                            border: "1px solid red",
                            borderColor: red[400],
                            borderWidth: 1,
                            borderStyle: "solid",
                            backgroundColor: alpha(red[50], 0),
                            "&:hover": {
                                backgroundColor: red[700],
                                borderColor: red[900],
                                color: "white",
                            },
                            "&:active": {
                                backgroundColor: red[700],
                            },
                            ...theme.applyStyles("dark", {
                                // backgroundColor: red[800],
                                borderColor: red[600],

                                "&:hover": {
                                    backgroundColor: red[700],
                                    borderColor: red[600],
                                },
                                "&:active": {
                                    backgroundColor: red[700],
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
                color: theme.palette.text.primary,
                border: "1px solid ",
                borderColor: gray[200],
                backgroundColor: alpha(gray[50], 0.3),
                "&:hover": {
                    backgroundColor: gray[100],
                    borderColor: gray[300],
                },
                "&:active": {
                    backgroundColor: gray[200],
                },
                ...theme.applyStyles("dark", {
                    backgroundColor: gray[800],
                    borderColor: gray[700],
                    "&:hover": {
                        backgroundColor: gray[900],
                        borderColor: gray[600],
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
                <CheckBoxOutlineBlankRoundedIcon
                    sx={{ color: "hsla(210, 0%, 0%, 0.0)" }}
                />
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
                    transform: "translate(14px, 50%)"
                },
                "&:has(.Mui-focused), &:has(.MuiFormLabel-filled)": {
                    "& .MuiFormLabel-root": {
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
                "&::placeholder": {
                    opacity: 0.7,
                    color: gray[500],
                },
                ...theme.applyStyles("dark", {
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
            root: ({ theme }) => ({
                padding: "8px 12px",
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius,
                transition: "border 120ms ease-in",
                border: '1px solid',
                borderColor: alpha(gray[300], 0.4),
                "&:hover": {
                    borderColor: gray[300]
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    border: 'none'
                },
                variants: [
                    {
                        props: {
                            size: "small",
                        },
                        style: {
                            // height: "2.25rem",
                        },
                    },
                    {
                        props: {
                            size: "medium",
                        },
                        style: {
                            // height: "2.5rem",
                        },
                    },
                ],
            }),
            notchedOutline: {
                border: 'none'
            },
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
                        border: 'none',
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
