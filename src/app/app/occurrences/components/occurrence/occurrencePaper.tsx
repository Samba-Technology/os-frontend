"use client"
import { Autocomplete, Box, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import PageviewIcon from '@mui/icons-material/Pageview';
import AuthContext from "@/contexts/authContext";
import { isAdmin } from "@/helpers/authorization";
import { Ocurrence } from "@/models/occurrence.model";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { Occurrenceservice } from "@/services/api/occurrence.service";
import WorkIcon from '@mui/icons-material/Work';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { toast } from "react-toastify";
import { StudentsService } from "@/services/api/students.service";
import { Student } from "@/models/student.model";
import { UsersService } from "@/services/api/users.service";
import { User } from "@/models/user.model";
import ocurrencePDF from "@/reports/occurrences/occurrence";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
import { io } from "socket.io-client";
import OcurrenceDialog from "./occurrenceDialog";
import StudentsDialog from "../students/studentsDialog";

interface OcurrencePaperProps {
    title: string,
    isArchive: boolean
}

export default function OcurrencePaper({ title, isArchive }: OcurrencePaperProps) {
    const [open, setOpen] = useState(false)
    const [openStudents, setOpenStudents] = useState(false)
    const [loading, setLoading] = useState(false)
    const [occurrences, setOccurrences] = useState<Ocurrence[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 5
    })
    const [total, setTotal] = useState(0)
    const [view, setView] = useState(false)
    const [dispatch, setDispatch] = useState(false)
    const [edit, setEdit] = useState(false)
    const [ocurrence, setOcurrence] = useState({})
    const [students, setStudents] = useState<Student[]>([])
    const [queryStudent, setQueryStudent] = useState<Student>()
    const [users, setUsers] = useState<User[]>([])
    const [queryUser, setQueryUser] = useState<User>()
    const [classes, setClasses] = useState<any[]>([])
    const [queryClass, setQueryClass] = useState<string>();

    const { user } = useContext(AuthContext)

    const columns: GridColDef[] = [
        {
            field: 'user',
            headerName: 'Profissional',
            width: 200,
            valueFormatter(params) {
                return params.value.name
            }
        },
        {
            field: 'students',
            headerName: 'Estudantes',
            flex: 1,
            valueGetter(params) {
                return params.value.map((student: any) => student.name.substring(0, 10) + " (" + student.class + ")").join(", ")
            },
        },
        {
            field: 'responsible',
            headerName: 'Responsável',
            width: 200,
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
                    case 'CANCELED':
                        icon = <CancelIcon />
                        text = 'Cancelada'
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
                let actions = [
                    <Tooltip key={params.id} title="Visualizar ocorrência">
                        <GridActionsCellItem icon={<PageviewIcon />} onClick={() => params.row.status === "OPENED" && user && params.row.userId === user.id ? editOcurrence(params.row) : viewOcurrence(params.row)} label="Visualizar Ocorrencia" />
                    </Tooltip>
                ]

                if (!isArchive) {
                    if (user && isAdmin(user.role)) {
                        actions = [
                            ...actions,
                            <GridActionsCellItem key={params.id} icon={<WorkIcon />} onClick={() => assumeOcurrence(params.row.id)} disabled={params.row.status === "OPENED" ? false : true} label="Assumir Ocorrencia" showInMenu />,
                            <GridActionsCellItem key={params.id} icon={<CommentIcon />} onClick={() => dispatchOcurrence(params.row)} disabled={params.row.status === "OPENED" ? true : params.row.status === "RESOLVED" ? true : false} label={params.row.status === "WAITING" ? "Editar despacho" : "Adicionar despacho"} showInMenu />,
                            <GridActionsCellItem key={params.id} icon={<CheckCircleIcon />} onClick={() => conclueOcurrence(params.row.id)} disabled={params.row.status === "WAITING" ? false : true} label="Concluir Ocorrência" showInMenu />,
                            <GridActionsCellItem key={params.id} icon={<PictureAsPdfIcon />} onClick={() => ocurrencePDF(params.row)} disabled={params.row.status === "WAITING" ? false : true} label="Visualização em PDF" showInMenu />
                        ]
                    }

                    if (user && params.row.status === "OPENED" && (params.row.userId === user.id || isAdmin(user.role))) {
                        actions = [
                            ...actions,
                            <GridActionsCellItem key={params.id} icon={<CancelIcon />} onClick={() => cancelOcurrence(params.row.id)} label="Cancelar Ocorrência" showInMenu />,
                        ]
                    }
                } else {
                    if (params.row.status !== "CANCELED") {
                        actions = [
                            ...actions,
                            <Tooltip key={params.id} title="Visualizar em PDF">
                                <GridActionsCellItem icon={<PictureAsPdfIcon />} onClick={() => ocurrencePDF(params.row)} label="Visualização em PDF" />
                            </Tooltip>
                        ]
                    }
                }


                return actions
            }
        }
    ]

    useEffect(() => {
        const fetchOccurrences = async () => {
            try {
                setLoading(true)
                const occurrences = await Occurrenceservice.findOccurrences(pagination.page + 1, pagination.pageSize, isArchive, queryStudent?.ra, queryUser?.id, queryClass)
                setOccurrences(occurrences.data)
                setTotal(occurrences.meta.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchOccurrences()
    }, [pagination, queryStudent, queryUser, queryClass, isArchive])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response)
                setClasses(Array.from(new Set(response.map(student => student.class))));
            } catch (e) {
                console.error(e)
            }
        }

        if (user && isAdmin(user.role)) {
            const fetchUsers = async () => {
                try {
                    const response = await UsersService.findUsers()
                    setUsers(response.data)
                } catch (e) {
                    console.error(e)
                }
            }

            fetchUsers()
        }

        fetchStudents()
    }, [openStudents, user])

    useEffect(() => {
        if (!isArchive && user && process.env.NEXT_PUBLIC_API_URL) {
            const socketInstance = io(process.env.NEXT_PUBLIC_API_URL);

            socketInstance.on('newOccurrence', (ocurrence) => {
                if (user.id === ocurrence.userId || isAdmin(user.role)) {
                    setOccurrences((prevOccurrences) => [...prevOccurrences, ocurrence]);
                    if (isAdmin(user.role) && ocurrence.userId !== user.id) toast.info("Nova ocorrência de " + ocurrence.user.name.split(' ')[0] + "!", { autoClose: false });
                }
            })

            socketInstance.on('editOccurrence', (ocurrence) => {
                if (user.id === ocurrence.userId || isAdmin(user.role)) {
                    refreshData(ocurrence);
                }
            })

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [user, isArchive])

    const viewOcurrence = (ocurrence: any) => {
        setView(true)
        setOcurrence(ocurrence)
        setOpen(true)
    }

    const assumeOcurrence = async (ocurrenceId: number) => {
        try {
            const ocurrence = await Occurrenceservice.assume(ocurrenceId)
            viewOcurrence(ocurrence);
            toast.success('Ocorrencia assumida com sucesso.')
        } catch (e: any) {
            toast.error(e.response.data.message)
        }
    }

    const dispatchOcurrence = async (ocurrence: any) => {
        setDispatch(true)
        viewOcurrence(ocurrence);
    }

    const editOcurrence = async (ocurrence: any) => {
        setEdit(true)
        viewOcurrence(ocurrence)
    }

    const conclueOcurrence = async (ocurrenceId: number) => {
        try {
            await Occurrenceservice.conclue(ocurrenceId)
            toast.success('Ocorrência concluida com sucesso.')
        } catch (e: any) {
            toast.error(e.response.data.message)
        }
    }

    const cancelOcurrence = async (ocurrenceId: number) => {
        try {
            Occurrenceservice.cancel(ocurrenceId)
            toast.success('Ocorrência cancelada com sucesso!')
        } catch (e: any) {
            toast.error(e.response.data.message)
        }
    }

    const refreshData = (ocurrence: any) => {
        setOccurrences((values) => {
            const occurrences = [...values]
            const index = occurrences.findIndex((value) => value.id === ocurrence.id)

            if (index !== -1) {
                if (ocurrence.deleted) {
                    occurrences.splice(index, 1)
                } else {
                    occurrences[index] = ocurrence
                }
            }
            return occurrences
        })
    }

    const handleClose = () => {
        setOpen(false)
        setOpenStudents(false)
        setView(false)
        setOcurrence({})
        setDispatch(false)
        setEdit(false)
    }

    return (
        <Paper elevation={3} className="flex flex-col w-[90%] gap-2 p-6">
            <Box component="div" className="flex flex-col gap-2 items-center">
                <div className="flex w-full justify-between items-center">
                    <h1 className="text-2xl">{title}</h1>
                    {!isArchive && <div className="flex gap-1">
                        <IconButton onClick={() => {
                            setEdit(true)
                            setOpen(true)
                        }} size="large">
                            <Tooltip title="Adicionar ocorrência">
                                <NoteAddIcon />
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => setOpenStudents(true)} size="large">
                            <Tooltip title="Adicionar aluno">
                                <GroupAddIcon />
                            </Tooltip>
                        </IconButton>
                    </div>}
                </div>
                {(occurrences.length > 0 || queryClass || queryStudent || queryUser) && (<div className="flex w-full flex-col gap-2 md:flex-row">
                    {user && isAdmin(user.role) && (
                        <Autocomplete
                            className="w-full"
                            disablePortal
                            options={users}
                            getOptionLabel={(user) => user.name}
                            onChange={(event, user, reason) => {
                                user && setQueryUser(user);
                                reason === "clear" && setQueryUser(undefined)
                            }}
                            renderInput={(params) => <TextField {...params} label="Pesquisa por Responsável" />}
                        />
                    )}
                    <Autocomplete
                        className="w-full"
                        disablePortal
                        options={classes}
                        getOptionLabel={(c) => c}
                        onChange={(event, c, reason) => {
                            c && setQueryClass(c);
                            reason === "clear" && setQueryClass(undefined)
                        }}
                        renderInput={(params) => <TextField {...params} label="Pesquisa por Série" />}
                    />
                    <Autocomplete
                        className="w-full"
                        disablePortal
                        options={students}
                        getOptionLabel={(student) => student.name + " (" + student.class + ")"}
                        onChange={(event, student, reason) => {
                            student && setQueryStudent(student);
                            reason === "clear" && setQueryStudent(undefined)
                        }}
                        renderInput={(params) => <TextField {...params} label="Pesquisa por Aluno(a)" />}
                    />
                </div>)}
            </Box>
            {occurrences.length > 0 ? <DataGrid
                rows={occurrences}
                loading={loading}
                columns={columns}
                rowCount={total}
                paginationMode="server"
                pageSizeOptions={[5, 6, 7]}
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                slotProps={{
                    pagination: {
                        labelRowsPerPage: "Linhas por página:",
                    }
                }}
            /> : <Paper elevation={3} className="flex flex-col w-full items-center p-5 gap-4">
                <h1 className="text-2xl">Está tudo tranquilo por aqui!</h1>
                <p>Excelente, parece que nenhuma ocorrência foi encontrada.</p>
            </Paper>}
            <OcurrenceDialog isOpen={open} onClose={handleClose} isView={view} ocurrence={ocurrence} dispatch={dispatch} edit={edit} />
            <StudentsDialog isOpen={openStudents} onClose={handleClose} />
        </Paper>
    )
}