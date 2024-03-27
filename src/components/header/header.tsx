import { Box, Divider, IconButton, Typography } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import ArchiveIcon from '@mui/icons-material/Archive';
import IconCodeSandbox from "../icons/logo";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
    const router = useRouter()

    const { user, signed } = useContext(AuthContext)

    return (
        <Box component="div" className="flex items-center h-[80px] w-full justify-between gap-10 px-16">
            <Box component="div" className="flex justify-center gap-3">
                <IconCodeSandbox fontSize="50px" />
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography variant="overline" fontSize="20px" fontWeight="bold">Samba Technology</Typography>
            </Box>
            <Box component="div" className="flex gap-6 items-center">
                {signed && (
                    <Box component="div" className="flex items-center gap-5">
                        <Box className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/app/ocurrences/archive')}>
                            <ArchiveIcon />
                            <Typography variant="overline" fontWeight="bold" >Arquivadas</Typography>
                        </Box>
                        <Box className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/app/ocurrences')}>
                            <DescriptionIcon />
                            <Typography variant="overline" fontWeight="bold" >Ocorrências</Typography>
                        </Box>
                        {!!user && isAdmin(user.role) ? (
                            <>
                                <Box className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/app/users')}>
                                    <GroupIcon />
                                    <Typography variant="overline" fontWeight="bold" >Usuários</Typography>
                                </Box>
                            </>
                        ) : null}
                        <Divider orientation="vertical" flexItem />
                        <IconButton onClick={() => {
                            localStorage.removeItem("access-token");
                            window.location.reload()
                        }}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    )
}