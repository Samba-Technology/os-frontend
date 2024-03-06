"use client"
import { Box, Container, CssBaseline, IconButton, Paper, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
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
import StudentsDialog from "@/components/students/studentsDialog";
import OcurrenceDialog from "@/components/ocurrence/ocurrenceDialog";

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
    const [ocurrence, setOcurrence] = useState({})

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
            field: 'responnsible',
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
            width: 120,
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
                        <GridActionsCellItem icon={<WorkIcon />} onClick={() => console.log(params)} label="Assumir Ocorrencia" />,
                        <GridActionsCellItem icon={<DeleteIcon />} onClick={() => console.log(params)} label="Deletar Ocorrência" />
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
                const ocurrences = await OcurrenceService.findOcurrences(pagination.page + 1, pagination.pageSize)
                setOcurrences(ocurrences.data)
                setTotal(ocurrences.data.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchOcurrences()
    }, [pagination])

    //Ações

    const viewOcurrence = (ocurrence: any) => {
        setView(true)
        setOcurrence(ocurrence)
        setOpen(true)
    }

    //----

    const handleClose = () => {
        setOpen(false)
        setOpenStudents(false)
        setView(false)
        setOcurrence({})
    }

    return (
        <Box className="flex justify-center items-center min-h-screen flex-col">
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Paper elevation={3} className="flex flex-col gap-2 p-6">
                    <Typography variant="h4">Ocorrências</Typography>
                    <Box component="div" className="flex flex-col gap-4 mt-2">
                        <Box component="div" className="flex gap-2 items-center">
                            <TextField type="search" placeholder="Procurar" fullWidth />
                            <IconButton onClick={() => setOpen(true)} size="large"><NoteAddIcon /></IconButton>
                            <IconButton onClick={() => setOpenStudents(true)} size="large"><GroupAddIcon /></IconButton>
                        </Box>
                            <DataGrid
                                rows={ocurrences}
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
            <OcurrenceDialog isOpen={open} onClose={handleClose} isView={view} ocurrence={ocurrence}/>
            <StudentsDialog isOpen={openStudents} onClose={handleClose} />
        </Box>
    )

}