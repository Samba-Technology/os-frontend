"use client"
import yup from "@/helpers/validation";
import { UsersService } from "@/services/api/users.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type Data = {
    name: string,
    email: string,
    password: string
}

const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
})

export default function UsersDialog({ isOpen, onClose}: Props) {
    const [loading, setLoading] = useState(false)

    const { handleSubmit, register, formState: { errors }} = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)
            await UsersService.create(data.name, data.email, data.password)
            toast.success('Conta criada com sucesso.')
        } catch (e: any) {
            if(e?.response?.data?.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error('Algo deu errado.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit)} >
            <DialogTitle>Criação de usuário</DialogTitle>
            <DialogContent className="flex flex-col w-full gap-4">
                <DialogContentText>Insira algumas informações do usuário que será criado.</DialogContentText>
                <TextField label="Nome Completo" variant="filled" error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
                <TextField label="Email" variant="filled" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
                <TextField label="Senha" type="password" variant="filled" error={!!errors.password} helperText={errors.password?.message} {...register("password")} />
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Criar"}</Button>
            </DialogActions>
        </Dialog>
    )
}