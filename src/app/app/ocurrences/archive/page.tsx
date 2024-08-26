"use client"
import { Autocomplete, Box, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import PageviewIcon from '@mui/icons-material/Pageview';
import { Ocurrence } from "@/models/ocurrence.model";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { OcurrenceService } from "@/services/api/ocurrence.service";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import OcurrenceDialog from "@/components/ocurrence/ocurrenceDialog";
import { Student } from "@/models/student.model";
import { StudentsService } from "@/services/api/students.service";
import { UsersService } from "@/services/api/users.service";
import { isAdmin } from "@/helpers/authorization";
import AuthContext from "@/contexts/auth";
import { User } from "@/models/user.model";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ocurrencePDF from "@/reports/ocurrences/ocurrence";
import CancelIcon from '@mui/icons-material/Cancel';

export default function ArchiveOcurrences() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ocurrences, setOcurrences] = useState<Ocurrence[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 5
    })
    const [total, setTotal] = useState(0)
    const [ocurrence, setOcurrence] = useState({})
    const [view, setView] = useState(false)
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
            width: 100,
            getActions: (params) => {
                let actions = [
                    <Tooltip key={params.id} title="Visualizar ocorrência">
                        <GridActionsCellItem icon={<PageviewIcon />} onClick={() => viewOcurrence(params.row)} label="Visualizar Ocorrencia" />
                    </Tooltip>,
                    <Tooltip key={params.id} title="Visualizar em PDF">
                        <GridActionsCellItem icon={<PictureAsPdfIcon />} onClick={() => ocurrencePDF(params.row)} label="Visualização em PDF" />
                    </Tooltip>
                ]

                return actions
            }
        }
    ]

    useEffect(() => {
        const fetchOcurrences = async () => {
            try {
                setLoading(true)
                const ocurrences = await OcurrenceService.findOcurrences(pagination.page + 1, pagination.pageSize, true, queryStudent?.ra, queryUser?.id, queryClass)
                
                setOcurrences(ocurrences.data)
                setTotal(ocurrences.meta.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchOcurrences()
    }, [pagination, queryStudent, queryUser, queryClass])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response);
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
    }, [user])

    const viewOcurrence = (ocurrence: any) => {
        setView(true)
        setOcurrence(ocurrence)
        setOpen(true)
    }

    const handleClose = () => {
        setView(false)
        setOpen(false)
        setOcurrence({})
    }

    return (
        <div className="flex h-full w-full justify-center items-center">
            <Paper elevation={3} className="flex w-[90%] flex-col gap-2 p-6 2xl:w-2/3">
                <h1 className="text-2xl">Ocorrências Arquivadas</h1>
                <Box component="div" className="flex gap-2 items-center">
                    <div className="flex w-full gap-2 flex-col md:flex-row">
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
                                reason === "clear" && setQueryUser(undefined)
                            }}
                            renderInput={(params) => <TextField {...params} label="Pesquisa por Série" />}
                        />
                        <Autocomplete
                            className="w-full"
                            disablePortal
                            options={students}
                            getOptionLabel={(student) => student.name}
                            onChange={(event, student, reason) => {
                                student && setQueryStudent(student);
                                reason === "clear" && setQueryStudent(undefined)
                            }}
                            renderInput={(params) => <TextField {...params} label="Pesquisa por Aluno(a)" />}
                        />
                    </div>
                </Box>
                <DataGrid
                    rows={ocurrences}
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
            </Paper>
            <OcurrenceDialog isOpen={open} onClose={handleClose} isView={view} ocurrence={ocurrence} dispatch={false} />
        </div>
    )

}