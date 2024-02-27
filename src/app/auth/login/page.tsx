"use client"
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Container, CssBaseline, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import yup from "@/helpers/validation"
import { AuthService } from "@/services/api/auth.service";
import { useState } from "react";
import api from "@/helpers/api";
import { toast } from "react-toastify";

type Data = {
    email: string,
    password: string
}

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
})

export default function Login() {
    const [loading, setLoading] = useState(false)

    const { handleSubmit, register, formState: { errors } } = useForm<Data>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: Data) => {
        try {
            setLoading(true)
            const response = await AuthService.login(data.email, data.password)
            localStorage.setItem("access-token", response.accessToken)
            api.defaults.headers.common["Authorization"] = 'Bearer ' + response.accessToken
            toast.success('Logado com sucesso!')
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
        <Box className="flex justify-center items-center min-h-screen flex-col">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper component="form" elevation={3} onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center p-4">
                    <Box className="mb-3">
                        <Typography variant="h5" fontWeight="bold">Entrar</Typography>
                    </Box>
                    <Box className="flex flex-col gap-4 w-full">
                        <TextField label="Email" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
                        <TextField label="Senha" error={!!errors.password} helperText={errors.password?.message} type="password" {...register("password")} />
                        <Button type="submit" variant="outlined" className="w-full h-[56px]" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Entrar"}</Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )

}