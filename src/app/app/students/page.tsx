"use client"
import AuthContext from "@/contexts/authContext";
import { isAdmin } from "@/helpers/authorization";
import { Autocomplete, Box, CircularProgress, IconButton, Paper, Skeleton, TextField, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { JSX, useContext, useEffect, useState } from "react";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Student } from "@/models/student.model";
import { StudentsService } from "@/services/api/students.service";
import StudentsDialog from "./components/StudentDialog";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StudentsUploadDialog from "./components/StudentsUploadDialog";

export default function Students() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [students, setStudents] = useState<Student[]>([])
    const [searchStudents, setSearchStudents] = useState<Student[]>([])
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 5
    })
    const [total, setTotal] = useState(0)
    const [studentView, setStudentView] = useState({})
    const [queryStudent, setQueryStudent] = useState<Student>()
    const [edit, setEdit] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    const { user } = useContext(AuthContext)

    const columns: GridColDef[] = [
        {
            field: 'ra',
            headerName: 'RA'
        },
        {
            field: 'name',
            headerName: 'Nome',
            flex: 1
        },
        {
            field: 'class',
            headerName: 'Classe'
        },
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            getActions: (params) => {
                let actions: JSX.Element[] = [];

                if (user && isAdmin(user.role)) {
                    actions = [
                        <Tooltip key={params.id} title="Editar Estudante">
                            <GridActionsCellItem icon={<ManageAccountsIcon />} onClick={() => editStudent(params.row)} label="Editar Estudante" />
                        </Tooltip>
                    ]
                }

                return actions
            }
        }
    ]

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true)

                const students = await StudentsService.findStudents(pagination.page + 1, pagination.pageSize, queryStudent?.ra)
                const sStudents = await StudentsService.findStudents()

                setSearchStudents(sStudents.data);
                setStudents(students.data);
                setTotal(students.meta.total);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchStudents()
    }, [pagination, queryStudent])

    //Ações

    const editStudent = (student: any) => {
        setStudentView(student);
        setEdit(true);
        setOpen(true);
    }

    // --

    const handleClose = () => {
        setOpen(false)
        setUploadOpen(false)

        setTimeout(() => {
            setStudentView({})
            setEdit(false);
        }, 200);
    }

    return (
        <div className="flex h-full w-full justify-center items-center">
            <Paper elevation={3} className="flex flex-col w-[90%] gap-2 p-6">
                <Box className="flex items-center justify-between">
                    <h1 className="text-2xl">Estudantes</h1>
                    <div>
                        <IconButton onClick={() => setOpen(true)} size="large">
                            <Tooltip title="Criar estudante">
                                <PersonAddAlt1Icon />
                            </Tooltip>
                        </IconButton>
                        {user && isAdmin(user.role) && <IconButton onClick={() => setUploadOpen(true)} size="large">
                            <Tooltip title="Criar vários estudantes">
                                <GroupAddIcon />
                            </Tooltip>
                        </IconButton>}
                    </div>
                </Box>
                <Box component="div" className="flex flex-col gap-4 mt-2">
                    <Box component="div" className="flex gap-2 items-center">
                        <Autocomplete
                            fullWidth
                            disablePortal
                            options={searchStudents}
                            getOptionLabel={(student) => student.name + " (" + student.class + ")"}
                            onChange={(event, user, reason) => {
                                user && setQueryStudent(user);
                                reason === "clear" && setQueryStudent(undefined)
                            }}
                            renderInput={(params) => <TextField {...params} label="Pesquisar Estudante" />}
                        />
                    </Box>
                    {students.length === 0 && loading && !queryStudent ? <Skeleton variant="rectangular" animation="wave" height={100} />
                        : <DataGrid
                            rows={students}
                            loading={loading}
                            columns={columns}
                            paginationMode="server"
                            pageSizeOptions={[5, 6, 7]}
                            paginationModel={pagination}
                            onPaginationModelChange={setPagination}
                            rowCount={total}
                            getRowId={(row) => row.ra}
                            slotProps={{
                                pagination: {
                                    labelRowsPerPage: "Linhas por página:",
                                }
                            }}
                        />}
                </Box>
            </Paper>
            <StudentsDialog isOpen={open} onClose={handleClose} student={studentView} isEdit={edit} />
            <StudentsUploadDialog isOpen={uploadOpen} onClose={handleClose} />
        </div>
    )

}