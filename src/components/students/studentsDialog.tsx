"use client"
import yup from "@/helpers/validation";
import { StudentsService } from "@/services/api/students.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
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

export default function StudentsDialog({ isOpen, onClose }: Props) {
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, register, formState: { errors }, reset } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            series: "",
            class: "",
            ra: ""
        }
    })

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)
            await StudentsService.create(data.ra, data.name, data.series, data.class)
            toast.success('Estudante criado com sucesso!')
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
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Criação de estudante</DialogTitle>
            <DialogContent className="flex flex-col w-full gap-2">
                <DialogContentText>Insira algumas informações do estudante que será criado.</DialogContentText>
                <TextField className="w-full" label="Nome Completo" variant="filled" error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
                <Box className="flex gap-1">
                    <FormControl variant="filled" className="w-1/2">
                        <InputLabel>Série</InputLabel>
                        <Controller
                            name="series"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Select variant="filled" label="Série" error={!!errors.series} value={value} onChange={onChange} >
                                    <MenuItem value="6º">6º</MenuItem>
                                    <MenuItem value="7º">7º</MenuItem>
                                    <MenuItem value="8º">8º</MenuItem>
                                    <MenuItem value="1ª">1ª</MenuItem>
                                    <MenuItem value="2ª">2ª</MenuItem>
                                    <MenuItem value="3ª">3ª</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl variant="filled" className="w-1/2">
                        <InputLabel>Turma</InputLabel>
                        <Controller
                            name="class"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Select variant="filled" label="Turma" error={!!errors.class} value={value} onChange={onChange}>
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="D">D</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Box>
                <TextField label="RA" variant="filled" error={!!errors.ra} helperText={errors.ra?.message} {...register("ra")} />
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" onClick={() => {
                    onClose();
                    reset();
                }}>Fechar</Button>
                <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Criar"}</Button>
            </DialogActions>
        </Dialog>
    )
}