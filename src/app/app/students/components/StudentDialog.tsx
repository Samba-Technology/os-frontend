"use client"
import yup from "@/helpers/validation";
import { StudentsService } from "@/services/api/students.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    student?: any;
}

type Data = {
    name: string,
    series: string,
    class: string,
    ra: string
}

const schema = yup.object({
    name: yup.string().required(),
    series: yup.string().required(),
    class: yup.string().required(),
    ra: yup.string().required().matches(/^\d{9}[A-z0-9]$/, 'RA inválido')
})

export default function StudentsDialog({ isOpen, onClose, isEdit, student }: Props) {
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, register, formState: { errors }, reset, setValue } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            series: "",
            class: "",
            ra: ""
        }
    })

    useEffect(() => {
        if (isEdit) {
            setValue("ra", student.ra)
            setValue("name", student.name)
            setValue("series", student.class.split('')[0])
            setValue("class", student.class.split('')[1])
        } else {
            reset()
        }
    }, [isEdit, setValue, student.ra, student.name, student.class, reset])

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)

            if (isEdit) {
                await StudentsService.edit(data.ra, data.name, data.series, data.class)
                toast.success('Estudante editado com sucesso!')
            } else {
                await StudentsService.create(data.ra, data.name, data.series, data.class)
                toast.success('Estudante criado com sucesso!')
            }

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
            <DialogTitle className="flex justify-between items-center">
                <p>{!isEdit && "Registro de"} Estudante</p>
                <div className="cursor-pointer" onClick={() => {
                    onClose()
                    reset()
                }}>
                    <Tooltip title="Fechar">
                        <CloseIcon />
                    </Tooltip>
                </div>
            </DialogTitle>
            <DialogContent className="flex flex-col w-full gap-2">
                <DialogContentText>Forneça os dados do estudante.</DialogContentText>
                <TextField className="w-full" label="Nome Completo" error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
                <Box className="flex gap-1">
                    <FormControl className="w-1/2">
                        <InputLabel>Série</InputLabel>
                        <Controller
                            name="series"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Select label="Série" error={!!errors.series} value={value} onChange={onChange} >
                                    <MenuItem value="6">6º</MenuItem>
                                    <MenuItem value="7">7º</MenuItem>
                                    <MenuItem value="8">8º</MenuItem>
                                    <MenuItem value="1">1ª</MenuItem>
                                    <MenuItem value="2">2ª</MenuItem>
                                    <MenuItem value="3">3ª</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl className="w-1/2">
                        <InputLabel>Turma</InputLabel>
                        <Controller
                            name="class"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Select label="Turma" error={!!errors.class} value={value} onChange={onChange}>
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="D">D</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Box>
                <TextField disabled={isEdit} label="RA" error={!!errors.ra} helperText={errors.ra?.message} {...register("ra")} />
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" type="submit" disabled={loading}>{isEdit ? "Editar" : "Criar"}</Button>
            </DialogActions>
        </Dialog>
    )
}