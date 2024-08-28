"use client"
import Header from "@/components/header/header"
import AuthContext from "@/contexts/authContext"
import { Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { signed } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (signed) {
            router.push('/app/ocurrences')
        }
    }, [router, signed])

    return (
        <div className='flex flex-col justify-between h-screen'>
            <Header />
            {children}
            <div className='flex flex-col items-center justify-center pb-2 gap-1'>
                <Image
                    src="/sambacode.png"
                    width={200}
                    height={50}
                    alt="Samba Code Logo"
                />
                <p className="text-xs md:text-base">Copyright © 2024 Todos os direitos reservados.</p>
            </div>
        </div>
    )
}