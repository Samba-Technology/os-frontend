"use client"
import UsersDialog from "@/components/users/usersDialog";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import { User } from "@/models/user.model";
import { Autocomplete, Box, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { UsersService } from "@/services/api/users.service";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/users/confirmDialog";

export default function Users() {
    const [open, setOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [searchUsers, setSearchUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 5
    })
    const [total, setTotal] = useState(0)
    const [view, setView] = useState(false)
    const [userV, setUserV] = useState({})
    const [userId, setUserId] = useState('')
    const [queryUser, setQueryUser] = useState<User>()

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
                <Tooltip title="Visualizar usuário">
                    <GridActionsCellItem key={params.id} icon={<ManageAccountsIcon />} onClick={() => viewUser(params.row)} label="Visualizar Usuário" />
                </Tooltip>,
                <Tooltip title="Deletar usuário">
                    <GridActionsCellItem key={params.id} icon={<DeleteIcon />} onClick={() => deleteUser(params.row.id)} label="Deletar Usuário" />
                </Tooltip>
            ]
        }
    ]

    useEffect(() => {
        if (user && !isAdmin(user.role)) {
            router.push('/app/users')
        }
    }, [user, router])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)

                const users = await UsersService.findUsers(pagination.page + 1, pagination.pageSize, queryUser?.id)
                const sUsers = await UsersService.findUsers()

                setSearchUsers(sUsers.data)
                setUsers(users.data)
                setTotal(users.meta.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [pagination, queryUser])

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
        <div className="flex h-full w-full justify-center items-center">
            <Paper elevation={3} className="flex flex-col w-[80%] gap-2 p-6 2xl:w-2/3">
                <Typography variant="h4">Usuários</Typography>
                <Box component="div" className="flex flex-col gap-4 mt-2">
                    <Box component="div" className="flex gap-2 items-center">
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={searchUsers}
                            getOptionLabel={(user) => user.name}
                            onChange={(event, user, reason) => {
                                user && setQueryUser(user);
                                reason === "clear" && setQueryUser(undefined)
                            }}
                            renderInput={(params) => <TextField {...params} label="Pesquisar Usuário" />}
                        />
                        <IconButton onClick={() => setOpen(true)} size="large">
                            <Tooltip title="Criar usuário">
                                <PersonAddAlt1Icon />
                            </Tooltip>
                        </IconButton>
                    </Box>
                    <DataGrid
                        rows={users}
                        loading={loading}
                        columns={columns}
                        paginationMode="server"
                        pageSizeOptions={[5, 6, 7]}
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
            <UsersDialog isOpen={open} onClose={handleClose} isView={view} user={userV} />
            <ConfirmDialog isOpen={confirmOpen} onClose={handleClose} onConfirm={handleConfirm} />
        </div>
    )

}