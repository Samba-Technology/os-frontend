"use client"
import { Autocomplete, Box, Container, CssBaseline, IconButton, Paper, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import PageviewIcon from '@mui/icons-material/Pageview';
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import { Ocurrence } from "@/models/ocurrence.model";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { OcurrenceService } from "@/services/api/ocurrence.service";
import WorkIcon from '@mui/icons-material/Work';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import StudentsDialog from "@/components/students/studentsDialog";
import OcurrenceDialog from "@/components/ocurrence/ocurrenceDialog";
import { toast } from "react-toastify";
import { StudentsService } from "@/services/api/students.service";
import { Student } from "@/models/student.model";
import { UsersService } from "@/services/api/users.service";
import { User } from "@/models/user.model";

export default function AppOcurrences() {
    const [open, setOpen] = useState(false)
    const [openStudents, setOpenStudents] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ocurrences, setOcurrences] = useState<Ocurrence[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10
    })
    const [total, setTotal] = useState(0)
    const [view, setView] = useState(false)
    const [dispatch, setDispatch] = useState(false)
    const [ocurrence, setOcurrence] = useState({})
    const [students, setStudents] = useState<Student[]>([])
    const [queryStudent, setQueryStudent] = useState<Student>()
    const [users, setUsers] = useState<User[]>([])
    const [queryUser, setQueryUser] = useState<User>()

    const { user } = useContext(AuthContext)

    const columns: GridColDef[] = [
        {
            field: 'user',
            headerName: 'Profissional',
            width: 150,
            valueFormatter(params) {
                return params.value.name
            }
        },
        {
            field: 'students',
            headerName: 'Estudantes',
            flex: 1,
            valueGetter(params) {
                return params.value.map((student: any) => student.name).join(", ")
            },
        },
        {
            field: 'responsible',
            headerName: 'Responsável',
            width: 150,
            valueFormatter(params) {
                return params.value ? params.value.name : ""
            },
        },
        {
            field: 'level',
            headerName: 'Gravidade',
            valueFormatter(params) {
                const level = params.value
                let text;

                switch (level) {
                    case 'LOW':
                        text = 'Baixa'
                        break
                    case 'MEDIUM':
                        text = 'Média'
                        break
                    case 'HIGH':
                        text = 'Alta'
                        break
                    default:
                        text = undefined
                }

                return text
            }
        },
        {
            field: 'status',
            headerName: 'Situação',
            width: 140,
            renderCell(params) {
                const status = params.value
                let icon, text;

                switch (status) {
                    case 'OPENED':
                        icon = <ConfirmationNumberIcon />
                        text = 'Aberta'
                        break
                    case 'ASSUMED':
                        icon = <WorkHistoryIcon />
                        text = 'Assumida'
                        break
                    case 'WAITING':
                        icon = <AvTimerIcon />
                        text = 'Aguardando'
                        break
                    case 'RESOLVED':
                        icon = <CheckCircleIcon />
                        text = 'Resolvida'
                        break
                    default:
                        icon = undefined
                        text = undefined
                }

                return (
                    <div className="flex justify-center">
                        {icon}
                        <Typography sx={{ ml: 1 }} variant="subtitle1">{text}</Typography>
                    </div>
                )
            }
        },
        {
            field: 'createdAt',
            headerName: 'Data',
            valueFormatter(params) {
                return params.value ? (new Date(params.value)).toLocaleDateString() : ''
            },
        },
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            width: 120,
            getActions: (params) => {
                let actions = [<GridActionsCellItem icon={<PageviewIcon />} onClick={() => viewOcurrence(params.row)} label="Visualizar Ocorrencia" />]

                if (user && isAdmin(user.role)) {
                    actions = [
                        ...actions,
                        <GridActionsCellItem icon={<WorkIcon />} onClick={() => assumeOcurrence(params.row.id)} disabled={params.row.status === "OPENED" ? false : true} label="Assumir Ocorrencia" showInMenu />,
                        <GridActionsCellItem icon={<CommentIcon />} onClick={() => dispatchOcurrence(params.row)} disabled={params.row.status === "ASSUMED" ? false : true} label="Adicionar despacho" showInMenu />,
                        <GridActionsCellItem icon={<CheckCircleIcon />} onClick={() => conclueOcurrence(params.row.id)} disabled={params.row.status === "WAITING" ? false : true} label="Concluir Ocorrência" showInMenu />
                    ]
                }

                return actions
            }
        }
    ]

    useEffect(() => {
        const fetchOcurrences = async () => {
            try {
                setLoading(true)
                const ocurrences = await OcurrenceService.findOcurrences(pagination.page + 1, pagination.pageSize, false, queryStudent?.ra, queryUser?.id)
                setOcurrences(ocurrences.data)
                setTotal(ocurrences.meta.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchOcurrences()
    }, [pagination, queryStudent, queryUser])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response)
            } catch (e) {
                console.error(e)
            }
        }

        const fetchUsers = async () => {
            try {
                const response = await UsersService.findUsers()
                setUsers(response.data)
            } catch (e) {
                console.error(e)
            }
        }

        fetchUsers()
        fetchStudents()
    }, [openStudents])

    //Ações

    const viewOcurrence = (ocurrence: any) => {
        setView(true)
        setOcurrence(ocurrence)
        setOpen(true)
    }

    const assumeOcurrence = async (ocurrenceId: number) => {
        try {
            const ocurrence = await OcurrenceService.assume(ocurrenceId)
            viewOcurrence(ocurrence)
            refreshData(ocurrence)
            toast.success('Ocorrencia assumida com sucesso.')
        } catch (e: any) {
            toast.error(e.response.data.message)
        }
    }

    const dispatchOcurrence = async (ocurrence: any) => {
        setDispatch(true)
        viewOcurrence(ocurrence)
    }

    const conclueOcurrence = async (ocurrenceId: number) => {
        try {
            const ocurrence = await OcurrenceService.conclue(ocurrenceId)
            refreshData(ocurrence)
            toast.success('Ocorrencia concluida com sucesso.')
        } catch (e: any) {
            toast.error(e.response.data.message)
        }
    }

    const refreshData = (ocurrence: any) => {
        setOcurrences((values) => {
            const ocurrences = [...values]
            const index = ocurrences.findIndex((value) => value.id === ocurrence.id)

            if (index !== -1) {
                if (ocurrence.deleted) {
                    ocurrences.splice(index, 1)
                } else {
                    ocurrences[index] = ocurrence
                }
            }
            return ocurrences
        })
    }

    //----

    const handleClose = () => {
        setOpen(false)
        setOpenStudents(false)
        setView(false)
        setOcurrence({})
        setDispatch(false)
    }

    return (
        <Box className="flex justify-center items-center h-3/4 flex-col">
            <CssBaseline />
            <Container component="main" maxWidth="lg">
                <Paper elevation={3} className="flex flex-col gap-2 p-6">
                    <Box component="div" className="flex flex-col gap-4 mt-2">
                        <Box component="div" className="flex gap-2 items-center">
                            <Autocomplete
                                fullWidth
                                disablePortal
                                options={users}
                                getOptionLabel={(user) => user.name}
                                onChange={(event, user, reason) => {
                                    user && setQueryUser(user);
                                    reason === "clear" && setQueryUser(undefined)
                                }}
                                renderInput={(params) => <TextField {...params} label="Pesquisa por Responsável" />}
                            />
                            <Autocomplete
                                fullWidth
                                disablePortal
                                options={students}
                                getOptionLabel={(student) => student.name}
                                onChange={(event, student, reason) => {
                                    student && setQueryStudent(student);
                                    reason === "clear" && setQueryStudent(undefined)
                                }}
                                renderInput={(params) => <TextField {...params} label="Pesquisa por Aluno(a)" />}
                            />
                            <IconButton onClick={() => setOpen(true)} size="large">
                                <NoteAddIcon />
                            </IconButton>
                            <IconButton onClick={() => setOpenStudents(true)} size="large">
                                <GroupAddIcon />
                            </IconButton>
                        </Box>
                        <DataGrid
                            rows={ocurrences}
                            loading={loading}
                            columns={columns}
                            rowCount={total}
                            paginationMode="server"
                            pageSizeOptions={[10, 20, 30, 40]}
                            paginationModel={pagination}
                            onPaginationModelChange={setPagination}
                        />
                    </Box>
                </Paper>
            </Container>
            <OcurrenceDialog isOpen={open} onClose={handleClose} isView={view} ocurrence={ocurrence} dispatch={dispatch} />
            <StudentsDialog isOpen={openStudents} onClose={handleClose} />
        </Box>
    )

}