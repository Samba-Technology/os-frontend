import { Box, Divider, Fab, IconButton, Typography } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import ArchiveIcon from '@mui/icons-material/Archive';
import IconCodeSandbox from "../icons/logo";

export default function Header() {
    const router = useRouter()

    const { user } = useContext(AuthContext)

    return (
        <Box component="div" className="flex h-[80px] w-full justify-between items-center gap-10 px-16">
            <Box component="div" className="flex items-center justify-center gap-3">
                <IconCodeSandbox fontSize="50px" />
                <Divider orientation="vertical" variant="middle" flexItem />
                <Typography variant="overline" fontSize="20px" className="text-slate-600">Sistema Samba</Typography>
            </Box>
            <Box component="div" className="flex gap-5">
                <Fab variant="extended" className="gap-2" onClick={() => router.push('/app/ocurrences/archive')}>
                    <ArchiveIcon />
                    <Typography variant="overline" fontWeight="bold">Arquivadas</Typography>
                </Fab>
                <Fab variant="extended" className="gap-2" onClick={() => router.push('/app/ocurrences')}>
                    <DescriptionIcon />
                    <Typography variant="overline" fontWeight="bold">Ocorrências</Typography>
                </Fab>
                {!!user && isAdmin(user.role) ? (
                    <>
                        <Fab variant="extended" className="gap-2" onClick={() => router.push('/app/users')}>
                            <GroupIcon />
                            <Typography variant="overline" fontWeight="bold">Usuários</Typography>
                        </Fab>
                    </>
                ) : null}
            </Box>
        </Box>
    )
}