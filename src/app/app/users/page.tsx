"use client"
import UsersDialog from "@/components/users/usersDialog";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import { User } from "@/models/user.model";
import { Box, Container, CssBaseline, IconButton, Paper, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { UsersService } from "@/services/api/users.service";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/users/confirmDialog";

export default function AppUsers() {
    const [open, setOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10
    })
    const [total, setTotal] = useState(0)
    const [view, setView] = useState(false)
    const [userV, setUserV] = useState({})
    const [userId, setUserId] = useState('')

    const { user } = useContext(AuthContext)
    const router = useRouter()

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
                <GridActionsCellItem icon={<ManageAccountsIcon />} onClick={() => viewUser(params.row)} label="Visualizar Usuário" />,
                <GridActionsCellItem icon={<DeleteIcon />} onClick={() => deleteUser(params.row.id)} label="Deletar Usuário" />
            ]
        }
    ]

    useEffect(() => {
        if (user && !isAdmin(user.role)) {
            router.push('/app/users')
        }
    }, [])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const users = await UsersService.findUsers(pagination.page + 1, pagination.pageSize)
                setUsers(users.data)
                setTotal(users.meta.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [pagination])

    //Ações

    const viewUser = (user: any) => {
        setView(true)
        setUserV(user)
        setOpen(true)
    }

    const deleteUser = (id: string) => {
        setConfirmOpen(true)
        setUserId(id)
    }

    // --

    const handleClose = () => {
        setOpen(false)
        setView(false)
        setUserV({})
        setConfirmOpen(false)
    }

    const handleConfirm = async () => {
        if (userId) {
            try {
                const user = await UsersService.delete(userId)
                refreshData(user)
                toast.success('Usuário deletado com sucesso!')
            } catch (e: any) {
                toast.error(e.response.data.message)
            }
        }
        setUserId('')
        setConfirmOpen(false)
    }

    const refreshData = (user: any) => {
        setUsers((values) => {
            const users = [...values]
            const index = users.findIndex((value) => value.id === user.id)

            if (index !== -1) {
                if (user.deleted) {
                    users.splice(index, 1)
                } else {
                    users[index] = user
                }
            }
            return users
        })
    }

    return (
        <Box className="flex justify-center items-center h-3/4 flex-col">
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
                            componentsProps={{
                                pagination: {
                                    labelRowsPerPage: "Linhas por página:",
                                }
                            }}
                        />
                    </Box>
                </Paper>
            </Container>
            <UsersDialog isOpen={open} onClose={handleClose} isView={view} user={userV} />
            <ConfirmDialog isOpen={confirmOpen} onClose={handleClose} onConfirm={handleConfirm} />
        </Box>
    )

}