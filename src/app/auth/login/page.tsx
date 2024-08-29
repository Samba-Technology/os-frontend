"use client"
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import yup from "@/helpers/validation"
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/contexts/authContext";
import { useRouter } from "next/navigation";

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

    const { login } = useContext(AuthContext)
    const router = useRouter()
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

            await login({ email: data.email, password: data.password })
            router.push('/app/ocurrences')
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
        <Box className="flex justify-center items-center h-full flex-col">
            <Container component="main" maxWidth="xs">
                <Paper component="form" elevation={3} onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center p-4">
                    <Box className="mb-3">
                        <Typography variant="h5" fontWeight="bold">Entrar</Typography>
                    </Box>
                    <Box className="flex flex-col gap-4 w-full">
                        <TextField label="Email" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
                        <TextField label="Senha" error={!!errors.password} helperText={errors.password?.message} type="password" {...register("password")} />
                        <Button type="submit" variant="contained" className="w-full h-[56px]" disabled={loading}>{loading ? <CircularProgress size={20} /> : "Entrar"}</Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )

}