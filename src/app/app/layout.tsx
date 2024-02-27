"use client"
import AuthContext from '@/contexts/auth';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { signed } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (!signed) {
            router.push('/auth/login')
        }
    }, [signed])

    return children
}