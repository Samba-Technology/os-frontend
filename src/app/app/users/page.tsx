"use client"
import StudentsDialog from "@/components/users/studentsDialog";
import UsersDialog from "@/components/users/usersDialog";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import { User } from "@/models/user.model";
import { Box, Button, Container, CssBaseline, IconButton, Paper, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { UsersService } from "@/services/api/users.service";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Nome',
        flex: 1
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 230
    },
    {
        field: 'actions',
        type: 'actions',
        sortable: false,
        getActions: (params) => [
            <GridActionsCellItem icon={<ManageAccountsIcon />} onClick={() => console.log(params)} label="Editar Usuário" />,
            <GridActionsCellItem icon={<DeleteIcon />} onClick={() => console.log(params)} label="Deletar Usuário" />
        ]
    }
]

export default function Login() {
    const [open, setOpen] = useState(false)
    const [openStudents, setOpenStudents] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10
    })
    const [total, setTotal] = useState(0)

    const { user } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (user && !isAdmin(user.role)) {
            router.push('/app/ocurrences')
        }
    }, [])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const users = await UsersService.findUsers(pagination.page + 1, pagination.pageSize)
                setUsers(users.data)
                setTotal(users.data.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [pagination])


    const handleClose = () => {
        setOpen(false)
        setOpenStudents(false)
    }

    return (
        <Box className="flex justify-center items-center min-h-screen flex-col">
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Paper elevation={3} className="flex flex-col gap-2 p-6">
                    <Typography variant="h4">Usuários</Typography>
                    <Box component="div" className="flex flex-col gap-4 mt-2">
                        <Box component="div" className="flex gap-2 items-center">
                            <TextField type="search" placeholder="Procurar" fullWidth />
                            <IconButton onClick={() => setOpen(true)} size="large"><PersonAddAlt1Icon /></IconButton>
                        </Box>
                        <DataGrid
                            rows={users}
                            loading={loading}
                            columns={columns}
                            paginationMode="server"
                            pageSizeOptions={[10, 20, 30, 40]}
                            paginationModel={pagination}
                            onPaginationModelChange={setPagination}
                            rowCount={total}
                        />
                    </Box>
                </Paper>
            </Container>
            <UsersDialog isOpen={open} onClose={handleClose} />
        </Box>
    )

}