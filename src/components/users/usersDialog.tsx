"use client"
import yup from "@/helpers/validation";
import { UsersService } from "@/services/api/users.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isView: boolean;
    user?: any;
}

type Data = {
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
}

const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required().matches(/^[a-z0-9](\.?[a-z0-9]){5,}@(?:prof(?:essor)?\.)?educacao\.sp\.gov\.br$/, 'O email deve ser Institucional.'),
    password: yup.string().min(8).required(),
    passwordConfirm: yup.string().min(8).required('A confirmação de senha é necessária.').oneOf([yup.ref('password')], "As senhas não coincidem.")
})

export default function UsersDialog({ isOpen, onClose, isView, user }: Props) {
    const [loading, setLoading] = useState(false)

    const { handleSubmit, register, formState: { errors }, reset, setValue } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        if (isView) {
            setValue("name", user.name)
            setValue("email", user.email)
        }
    }, [isView])

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)
            await UsersService.create(data.name, data.email, data.password)
            toast.success('Conta criada com sucesso.')
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
            window.location.reload()
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} component="form" onSubmit={handleSubmit(onSubmit)} fullWidth>
            <DialogTitle>Criação de usuário</DialogTitle>
            <DialogContent className="flex flex-col w-full gap-2">
                {!isView && <DialogContentText>Forneça os dados do usuário.</DialogContentText>}
                <TextField label="Nome Completo" variant="filled" disabled={isView} error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
                <TextField label="Email" variant="filled" disabled={isView} error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
                {!isView && (
                    <>
                        <TextField label="Senha" type="password" disabled={isView} variant="filled" error={!!errors.password} helperText={errors.password?.message} {...register("password")} />
                        <TextField label="Confirmar Senha" type="password" disabled={isView} variant="filled" error={!!errors.passwordConfirm} helperText={errors.passwordConfirm?.message} {...register("passwordConfirm")} />
                    </>
                )}
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" onClick={() => {
                    onClose();
                    reset()
                }}>Fechar</Button>
                {!isView && <Button variant="contained" type="submit" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Criar"}</Button>}
            </DialogActions>
        </Dialog>
    )
}