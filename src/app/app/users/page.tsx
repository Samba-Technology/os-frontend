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
    const [openStudents, setOpenStudents] = useState(false)

    const { user } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (user && !isAdmin(user.role)) {
            router.push('/app/ocurrences')
        }
    }, [])

    const handleClose = () => {
        setOpen(false)
        setOpenStudents(false)
    }

    return (
        <Box className="flex justify-center items-center min-h-screen flex-col">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Button variant="contained" onClick={() => setOpen(true)}>Criar Usuário</Button>
                <Button variant="contained" onClick={() => setOpenStudents(true)}>Criar Estudante</Button> 
                <UsersDialog isOpen={open} onClose={handleClose} />
                <StudentsDialog isOpen={openStudents} onClose={handleClose} />
            </Container>
        </Box>
    )

}