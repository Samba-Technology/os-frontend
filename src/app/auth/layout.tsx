"use client"
import Footer from "@/components/footer/Footer"
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
            <Footer />
        </div>
    )
}