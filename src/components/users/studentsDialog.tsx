"use client"
import yup from "@/helpers/validation";
import { Student } from "@/models/student.model";
import { StudentsService } from "@/services/api/students.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
    isOpen: boolean;
    onClose: () => void;
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

export default function StudentsDialog({ isOpen, onClose }: Props) {
    const [students, setStudents] = useState<Student[]>([])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await StudentsService.findStudents()
                setStudents(response)
                console.log(response)
            } catch (e) {
                console.error(e)
            }
        }

        fetchStudents()
    }, [])

    const { control, handleSubmit, register, formState: { errors } } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            description: "",
            level: "",
            students: []
        }
    })

    const onSubmit = (data: Data) => {
        console.log(data)
    }

    return (
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit)} fullWidth>
            <DialogTitle>Registro de Ocorrência</DialogTitle>
            <DialogContent className="flex flex-col gap-3">
                <DialogContentText>Forneça os dados da ocorrência.</DialogContentText>
                <Box component="div" className="flex gap-3">
                    <Controller
                        name="students"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                fullWidth
                                multiple
                                options={students}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, students) => { onChange(students) }}
                                value={value}
                                renderOption={(props, user) => (
                                    <li {...props} key={user.name} >
                                        {user.name}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        helperText={errors.students?.message}
                                        label="Alunos(as)"
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        )}
                    />
                    <FormControl className="w-1/3">
                        <InputLabel>Nível</InputLabel>
                        <Select label="Nível" {...register("level")}>
                            <MenuItem value="LOW">Baixo</MenuItem>
                            <MenuItem value="MEDIUM">Médio</MenuItem>
                            <MenuItem value="HIGH">Alto</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <TextField label="Descrição" fullWidth multiline rows="7" {...register("description")} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Criar</Button>
            </DialogActions>
        </Dialog>
    )
}