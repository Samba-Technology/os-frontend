import { GridColDef } from "@mui/x-data-grid"
import { Tooltip, Typography } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import PageviewIcon from '@mui/icons-material/Pageview';
import { isAdmin } from "@/helpers/authorization";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import WorkIcon from '@mui/icons-material/Work';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ocurrencePDF from "@/reports/ocurrences/ocurrence";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
export const columns: GridColDef[] = [
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
                    <GridActionsCellItem icon={<PageviewIcon />} onClick={() => params.row.status === "OPENED" ? editOcurrence(params.row) : viewOcurrence(params.row)} label="Visualizar Ocorrencia" />
                </Tooltip>
            ]

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

            return actions
        }
    }
]