"use client"
import AuthContext from "@/contexts/authContext";
import yup from "@/helpers/validation";
import { Student } from "@/models/student.model";
import { Occurrenceservice } from "@/services/api/occurrence.service";
import { StudentsService } from "@/services/api/students.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { User } from "@/models/user.model";
import { UsersService } from "@/services/api/users.service";
import CloseIcon from '@mui/icons-material/Close';
import { Tag } from "@mui/icons-material";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isView: boolean;
    occurrence?: any;
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
    tutors: yup.array().min(1).test('tutors-vs-students', 'O número de tutores deve ser menor ou igual ao número de alunos', (tutors: any, context: any) => {
        const { students } = context.parent as { students: any[] };
        return tutors && tutors.length <= students.length;
    }).required(),
    dispatch: yup.string().nullable()
})

export default function OccurrenceDialog({ isOpen, onClose, isView, occurrence, dispatch, edit }: Props) {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [tutors, setTutors] = useState<User[]>([])

    const { user } = useContext(AuthContext)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response.data)
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
            tutors: [],
            students: [],
            dispatch: ""
        }
    })

    useEffect(() => {
        if (isView) {
            setValue("students", occurrence.students.map((student: Student) => student.ra))
            occurrence.tutors && setValue("tutors", occurrence.tutors.map((tutor: User) => tutor.id))
            setValue("level", occurrence.level, { shouldValidate: true })
            setValue("description", occurrence.description)
            setValue("dispatch", occurrence.dispatch)
        } else {
            reset()
        }
    }, [isView, occurrence.description, occurrence.dispatch, occurrence.level, occurrence.students, occurrence.tutors, reset, setValue])

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)

            if (!dispatch && !isView) {
                await Occurrenceservice.create(data.description, data.level, data.students, data.tutors)
                toast.success('Ocorrência criada com sucesso!')
            } else if (dispatch) {
                if (data.dispatch) {
                    data.dispatch && await Occurrenceservice.dispatch(occurrence.id, data.dispatch, !!occurrence.dispatch)
                    toast.success('Despacho adicionado com sucesso.')
                } else {
                    toast.info("Preencha o despacho para editar essa ocorrência.")
                }
            } else if (edit) {
                await Occurrenceservice.edit(occurrence.id, data.description, data.level, data.students, data.tutors)
                toast.success('Ocorrência editada com sucesso!')
            }

            onClose();
            reset()
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

    const onError = (e: any) => {
        console.error(e);
    }

    return (
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit, onError)} fullWidth>
            <DialogTitle className="flex justify-between items-center">
                <div className="gap-2">
                    <div className="flex gap-2 items-center cursor-pointer">
                        <p>{!isView && "Registro de "}Ocorrência</p>
                        {isView &&
                            <Tooltip title={`Ocorrência de n°${occurrence.id}`}>
                                <Chip icon={<Tag />} size="small" label={occurrence.id} sx={{
                                    '& .MuiChip-label': {
                                        whiteSpace: 'normal',
                                        marginTop: 0.4,
                                        marginLeft: -0.5
                                    },
                                }} />
                            </Tooltip>
                        }
                    </div>
                    {isView && <p className="text-xs mt-1 md:text-sm">{occurrence.user.name}, {new Date(occurrence.createdAt)
                        .toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                        .replace(',', '')}</p>}
                </div>
                <div className="cursor-pointer" onClick={() => {
                    onClose()
                    reset()
                }}>
                    <Tooltip title="Fechar">
                        <CloseIcon />
                    </Tooltip>
                </div>
            </DialogTitle>
            <DialogContent className={`flex flex-col gap-3 ${isView && '!pt-2'}`}>
                {!isView && <Typography>Uma ocorrência pode ter mais de um aluno vinculado.</Typography>}
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
                <TextField disabled={!edit} label="Descrição" fullWidth multiline rows="7" error={!!errors.description} helperText={errors.description?.message} {...register("description")} inputProps={{ style: { textAlign: "justify", textJustify: "inter-word", paddingRight: 10 } }} />
                <FormControl disabled={!edit}>
                    <InputLabel>Nível</InputLabel>
                    <Controller
                        name="level"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <Select label="Nível" error={!!errors.level} value={value} onChange={onChange}>
                                <MenuItem value="LOW">Baixo</MenuItem>
                                <MenuItem value="MEDIUM">Médio</MenuItem>
                                <MenuItem value="HIGH">Alto</MenuItem>
                            </Select>

                        )}
                    />
                    <FormHelperText error={!!errors.level}>{errors.level?.message}</FormHelperText>
                </FormControl>
                {isView &&
                    <TextField disabled={!dispatch} fullWidth multiline rows="4" label="Despacho" {...register('dispatch')} inputProps={{ style: { textAlign: "justify", textJustify: "inter-word", paddingRight: 10 } }} />
                }
            </DialogContent>
            <DialogActions className={`flex w-full items-center !px-4 ${isView && "!justify-between"}`}>
                {isView && <p className="text-xs md:text-sm">Ultima atualização em {new Date(occurrence.updatedAt)
                    .toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    .replace(',', '')}.</p>}
                {!isView && <Button variant="contained" type="submit" disabled={loading}>Criar</Button>}
                {dispatch && <Button variant="contained" type="submit" disabled={loading}>Editar</Button>}
                {user && isView && edit && occurrence.userId == user.id && <Button variant="contained" type="submit" disabled={loading}>Editar</Button>}
            </DialogActions>
        </Dialog >
    )
}