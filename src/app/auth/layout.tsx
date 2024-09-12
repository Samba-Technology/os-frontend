"use client"
import Header from "@/components/header/Header"
import AuthContext from "@/contexts/authContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { signed } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (signed) {
            router.push('/app/occurrences')
        }
    }, [router, signed])

    return (
        <div className='flex flex-col justify-between h-screen'>
            <Header />
            {children}
            <div className='flex flex-col items-center justify-center pb-2 gap-1'>
                <a target="_blank" href="https://sambacode.com.br" className="text-xs md:text-base">Copyright © 2024 Samba Code – Todos os direitos reservados.</a>
            </div>
        </div>
    )
}