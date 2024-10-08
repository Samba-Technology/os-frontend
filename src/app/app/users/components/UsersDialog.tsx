"use client"
import yup from "@/helpers/validation";
import { UsersService } from "@/services/api/users.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
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
    email: yup.string().email().required().matches(/^[a-z0-9](\.?[a-z0-9]){2,}@(?:prof(?:essor)?\.)?educacao\.sp\.gov\.br$/, 'O email deve ser Institucional.'),
    password: yup.string().required().min(8),
    passwordConfirm: yup.string().required().min(8).oneOf([yup.ref('password')], "As senhas não coincidem.")
})

export default function UsersDialog({ isOpen, onClose, isEdit, user }: Props) {
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
        if (isEdit) {
            setValue("name", user.name)
            setValue("email", user.email)
        } else {
            reset()
        }
    }, [isEdit, setValue, user.email, user.name, reset])

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)
            if (!isEdit) {
                await UsersService.create(data.name, data.email, data.password)
                toast.success('Usuário criado com sucesso.');
            } else {
                await UsersService.edit(user.id, data.name, data.email, data.password);
                toast.success('Usuário editado com sucesso.');
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
                <p>Registro de Usuário</p>
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
                <DialogContentText>Forneça os dados do usuário.</DialogContentText>
                <TextField label="Nome Completo" error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
                <TextField label="Email" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
                <TextField label={isEdit ? 'Nova senha' : 'Senha'} type="password" error={!!errors.password} helperText={errors.password?.message} {...register("password")} />
                <TextField label="Confirmar Senha" type="password" error={!!errors.passwordConfirm} helperText={errors.passwordConfirm?.message} {...register("passwordConfirm")} />
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" type="submit" disabled={loading}>{isEdit ? "Editar" : "Criar"}</Button>
            </DialogActions>
        </Dialog>
    )
}