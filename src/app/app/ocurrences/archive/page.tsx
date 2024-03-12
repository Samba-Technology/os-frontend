"use client"
import { Box, Container, CssBaseline, IconButton, Paper, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import PageviewIcon from '@mui/icons-material/Pageview';
import { Ocurrence } from "@/models/ocurrence.model";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { OcurrenceService } from "@/services/api/ocurrence.service";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import OcurrenceDialog from "@/components/ocurrence/ocurrenceDialog";

export default function AppArchiveOcurrences() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ocurrences, setOcurrences] = useState<Ocurrence[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10
    })
    const [total, setTotal] = useState(0)
    const [ocurrence, setOcurrence] = useState({})
    const [view, setView] = useState(false)

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
            width: 50,
            getActions: (params) => [
                <GridActionsCellItem icon={<PageviewIcon />} onClick={() => viewOcurrence(params.row)} label="Visualizar Ocorrencia" />
            ]
        }
    ]

    useEffect(() => {
        const fetchOcurrences = async () => {
            try {
                setLoading(true)
                const ocurrences = await OcurrenceService.findOcurrences(pagination.page + 1, pagination.pageSize, true)
                setOcurrences(ocurrences.data)
                setTotal(ocurrences.meta.total)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchOcurrences()
    }, [pagination])

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
        <Box className="flex justify-center items-center h-3/4 flex-col">
            <CssBaseline />
            <Container component="main" maxWidth="lg">
                <Paper elevation={3} className="flex flex-col gap-2 p-6">
                    <Box component="div" className="flex flex-col gap-4 mt-2">
                        <Typography variant="h4">Ocorrências Arquivadas</Typography>
                        <Box component="div" className="flex gap-2 items-center">
                            <TextField type="search" placeholder="Procurar" fullWidth />
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
            <OcurrenceDialog isOpen={open} onClose={handleClose} isView={view} ocurrence={ocurrence} dispatch={false} />
        </Box>
    )

}