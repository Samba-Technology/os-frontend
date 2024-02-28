"use client"
import StudentsDialog from "@/components/users/studentsDialog";
import UsersDialog from "@/components/users/usersDialog";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import { Box, Button, Container, CssBaseline } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Login() {
    const [open, setOpen] = useState(false)
    const [openStudent, setOpenStudent] = useState(false)

    const { user } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (user && !isAdmin(user.role)) {
            router.push('/app/ocurrences')
        }
    }, [])

    const handleClose = () => {
        setOpen(false)
        setOpenStudent(false)
    }

    return (
        <Box className="flex justify-center items-center min-h-screen flex-col">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Button onClick={() => setOpen(true)}>Abrir</Button>
                <Button onClick={() => setOpenStudent(true)}>Abrir Students</Button>
                <UsersDialog isOpen={open} onClose={handleClose} />
                <StudentsDialog isOpen={openStudent} onClose={handleClose} />
            </Container>
        </Box>
    )

}