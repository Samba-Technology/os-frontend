"use client"
import AuthContext from "@/contexts/auth";
import yup from "@/helpers/validation";
import { Student } from "@/models/student.model";
import { OcurrenceService } from "@/services/api/ocurrence.service";
import { StudentsService } from "@/services/api/students.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmDialog from "../utils/confirmDialog";
import { User } from "@/models/user.model";
import { UsersService } from "@/services/api/users.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isView: boolean;
    ocurrence?: any;
    dispatch?: boolean;
    edit?: boolean;
}

type Data = {
    description: string,
    level: string,
    students: string[],
    tutors: number[],
    dispatch?: string | null,
}

const schema = yup.object({
    description: yup.string().required(),
    level: yup.string().required(),
    students: yup.array().min(1).required(),
    tutors: yup.array().min(1).required(),
    dispatch: yup.string().nullable()
})

export default function OcurrenceDialog({ isOpen, onClose, isView, ocurrence, dispatch, edit }: Props) {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [ocurrenceData, setOcurrenceData] = useState<Data>()
    const [tutors, setTutors] = useState<User[]>([])

    const { user } = useContext(AuthContext)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response)
            } catch (e) {
                console.error(e);
            }
        }

        const fetchTutors = async () => {
            try {
                const response = await UsersService.findUsers()
                setTutors(response.data)
            } catch (error) {
                console.error(error);
            }
        }

        fetchTutors();
        fetchStudents();
    }, [isOpen])

    const { control, handleSubmit, register, formState: { errors }, reset, setValue } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            description: "",
            level: "",
            students: [],
            dispatch: ""
        }
    })

    useEffect(() => {
        if (isView) {
            setValue("students", ocurrence.students.map((student: Student) => student.ra))
            ocurrence.tutors && setValue("tutors", ocurrence.tutors.map((tutor: User) => tutor.id))
            setValue("level", ocurrence.level, { shouldValidate: true })
            setValue("description", ocurrence.description)
            setValue("dispatch", ocurrence.dispatch)
        } else {
            reset()
        }
    }, [isView, ocurrence.description, ocurrence.dispatch, ocurrence.level, ocurrence.students, ocurrence.tutors, reset, setValue])

    const onSubmit = async (data: Data) => {
        setOcurrenceData(data);
        setConfirmOpen(true);
    }

    const onError = (e: any) => {
        console.error(e)
    }

    const handleConfirm = async () => {
        try {
            setLoading(true)
            if (ocurrenceData) {
                if (!dispatch && !isView) {
                    await OcurrenceService.create(ocurrenceData.description, ocurrenceData.level, ocurrenceData.students, ocurrenceData.tutors)
                    toast.success('Ocorrência criada com sucesso!')
                } else if (dispatch) {
                    ocurrenceData.dispatch && await OcurrenceService.dispatch(ocurrence.id, ocurrenceData.dispatch)
                    toast.success('Despacho adicionado com sucesso.')
                } else if (edit) {
                    await OcurrenceService.edit(ocurrence.id, ocurrenceData.description, ocurrenceData.level, ocurrenceData.students, ocurrenceData.tutors)
                    toast.success('Ocorrência editada com sucesso!')
                }
            }

            setConfirmOpen(false);
            onClose();
            reset();
        } catch (e: any) {
            if (e?.response?.data?.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error('Algo deu errado.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setConfirmOpen(false);
    }

    return (
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit, onError)} fullWidth>
            <DialogTitle className="flex justify-between items-center">
                <p>Registro de Ocorrência</p>
                {isView ? <p className="text-sm">{"Data da ocorrência: " + new Date(ocurrence.createdAt)
                    .toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    .replace(',', '')}</p> : null}
            </DialogTitle>
            <DialogContent className="flex flex-col gap-3">
                {!isView && <DialogContentText>Forneça os dados da ocorrência.</DialogContentText>}
                <Controller
                    name="students"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            fullWidth
                            multiple
                            disabled={!edit}
                            options={students}
                            getOptionLabel={(option) => option.name + " (" + option.class + ")"}
                            onChange={(event, students) => { onChange(students.map(student => student.ra)) }}
                            value={students.filter(student => value.includes(student.ra))}
                            renderOption={(params, student) => {
                                return (
                                    <li {...params} key={student.ra}>
                                        {student.name + " (" + student.class + ")"}
                                    </li>
                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    error={!!errors.students}
                                    helperText={errors.students?.message}
                                    label="Alunos(as)"
                                />
                            )}
                            renderTags={(value, getTagProps) => {
                                return value.map((option, index) => (
                                    <Chip {...getTagProps({ index })} key={option.ra} label={option.name + " (" + option.class + ")"} />
                                ))
                            }}
                        />)}
                />
                <Controller
                    name="tutors"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            fullWidth
                            multiple
                            disabled={!edit}
                            options={tutors}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, tutors) => { onChange(tutors.map(tutor => tutor.id)) }}
                            value={Array.isArray(value) ? tutors.filter(tutor => value.includes(tutor.id)) : []}
                            renderOption={(params, tutor) => {
                                return (
                                    <li {...params} key={tutor.id}>
                                        {tutor.name}
                                    </li>
                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    error={!!errors.tutors}
                                    helperText={errors.tutors?.message}
                                    label="Tutores(as)"
                                />
                            )}
                            renderTags={(value, getTagProps) => {
                                return value.map((option, index) => (
                                    <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
                                ))
                            }}
                        />)}
                />
                <TextField disabled={!edit} label="Descrição" variant="filled" fullWidth multiline rows="7" error={!!errors.description} helperText={errors.description?.message} {...register("description")} />
                <FormControl variant="filled" disabled={!edit}>
                    <InputLabel>Nível</InputLabel>
                    <Controller
                        name="level"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <Select label="Nível" variant="filled" error={!!errors.level} value={value} onChange={onChange}>
                                <MenuItem value="LOW">Baixo</MenuItem>
                                <MenuItem value="MEDIUM">Médio</MenuItem>
                                <MenuItem value="HIGH">Alto</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
                {isView ? <TextField disabled={!dispatch} variant="filled" fullWidth multiline rows="4" label="Despacho" {...register('dispatch')} /> : null}
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" onClick={() => {
                    onClose()
                    reset()
                }}>Fechar</Button>
                {!isView && <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Criar"}</Button>}
                {dispatch && <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Editar Despacho"}</Button>}
                {user && isView && edit && ocurrence.userId == user.id && <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Editar Ocorrência"}</Button>}
            </DialogActions>
            <ConfirmDialog isOpen={confirmOpen} onClose={handleClose} onConfirm={handleConfirm} title="Você tem certeza?" description="Garanta que todos os dados informados estão corretos antes de confirmar!" button="Confirmar" />
        </Dialog>
    )
}