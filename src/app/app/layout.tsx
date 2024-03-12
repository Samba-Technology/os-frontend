"use client"
import AuthContext from '@/contexts/auth';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/header';
import { Typography } from '@mui/material';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { signed } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (!signed) {
            router.push('/auth/login')
        }
    }, [signed])

    return (
        <div className='flex flex-col justify-between h-screen'>
            <Header />
            {children}
            <div className='flex justify-center pb-2'>
                <Typography variant='overline'>The Samba Inc. | S. SAMBA | V1.0 | 2024 ©</Typography>
            </div>
        </div>
    )
}