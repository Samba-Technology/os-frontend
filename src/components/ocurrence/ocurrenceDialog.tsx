"use client"
import yup from "@/helpers/validation";
import { Ocurrence } from "@/models/ocurrence.model";
import { Student } from "@/models/student.model";
import { OcurrenceService } from "@/services/api/ocurrence.service";
import { StudentsService } from "@/services/api/students.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isView: boolean;
    ocurrence?: any;
}

type Data = {
    description: string,
    level: string,
    students: Student[]
}

const schema = yup.object({
    description: yup.string().required(),
    level: yup.string().required(),
    students: yup.array().min(1).required()
})

export default function OcurrenceDialog({ isOpen, onClose, isView, ocurrence }: Props) {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response)
            } catch (e) {
                console.error(e)
            }
        }

        fetchStudents()
    }, [isOpen])

    const { control, handleSubmit, register, formState: { errors }, reset, setValue } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            description: "",
            level: "",
            students: []
        }
    })

    useEffect(() => {
        if (isView) {
            setValue("students", ocurrence.students)
            setValue("level", ocurrence.level, { shouldValidate: true })
            setValue("description", ocurrence.description)
        } else {
            reset()
        }
    }, [isView])

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)
            await OcurrenceService.create(data.description, data.level, data.students)
            toast.success('Ocorrencia criada com sucesso!')
            onClose()
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



    return (
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit)} fullWidth>
            <DialogTitle>Registro de Ocorrência</DialogTitle>
            <DialogContent className="flex flex-col gap-3">
                <DialogContentText>Forneça os dados da ocorrência.</DialogContentText>
                <Controller
                    name="students"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            fullWidth
                            multiple
                            disabled={isView}
                            options={students}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, students) => { onChange(students) }}
                            value={value}
                            renderOption={(params, student) => {
                                return (
                                    <li {...params} key={student.name}>
                                        {student.name}
                                    </li>
                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    helperText={errors.students?.message}
                                    label="Alunos(as)"
                                />
                            )}
                        />)}
                />
                <TextField disabled={isView} label="Descrição" variant="filled" fullWidth multiline rows="7" error={!!errors.description} helperText={errors.description?.message} {...register("description")} />
                <FormControl variant="filled" disabled={isView}>
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
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" onClick={() => {
                    onClose()
                    reset()
                }}>Fechar</Button>
                {!isView && <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Criar"}</Button>}
            </DialogActions>
        </Dialog>
    )
}