"use client"
import AuthContext from '@/contexts/auth';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { signed } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (!signed) {
            router.push('/auth/login')
        }
    }, [signed])

    return (
        <div className='h-screen'>
            <Header />
            {children}
        </div>
    )
}