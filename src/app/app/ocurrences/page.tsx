"use client"
import OcurrenceDialog from "@/components/users/ocurrenceDialog";
import { Box, Button, Container, CssBaseline } from "@mui/material";
import { useState } from "react";

export default function Login() {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Box className="flex justify-center items-center min-h-screen flex-col">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Button variant="contained" onClick={() => setOpen(true)}>Abrir Ocurrence</Button>
                <OcurrenceDialog isOpen={open} onClose={handleClose} />
            </Container>
        </Box>
    )

}