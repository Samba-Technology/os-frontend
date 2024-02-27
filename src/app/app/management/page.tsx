"use client"
import UsersDialog from "@/components/users/usersDialog";
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
                <Button onClick={() => setOpen(true)}>Abrir</Button>
                <UsersDialog isOpen={open} onClose={handleClose} />
            </Container>
        </Box>
    )

}