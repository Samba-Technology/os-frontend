"use client"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const darkTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
        background: {
            default: 'rgba(250,250,250,0.82)',
            paper: '#fff',
        },
    },
})

export default function Mui({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}