"use client"
import Header from "@/components/header/header"
import AuthContext from "@/contexts/auth"
import { Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { signed } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (signed) {
            router.push('/app/ocurrences')
        }
    }, [])

    return (
        <div className='flex flex-col justify-between h-screen'>
            <Header />
            {children}
            <div className='flex justify-center pb-2'>
                <Typography variant='overline'>Samba Technology | V1.1.3 | 2024 ©</Typography>
            </div>
        </div>
    )
}