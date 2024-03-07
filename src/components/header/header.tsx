import { Box, IconButton, Typography } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";

export default function Header() {
    const router = useRouter()

    const { user } = useContext(AuthContext)

    return (
        <Box component="div" className="flex h-[80px] w-full justify-center items-center gap-10 px-16">
            <IconButton color="primary" size="large" onClick={() => router.push('/app/ocurrences')}>
                <DescriptionIcon />
            </IconButton>
            {!!user && isAdmin(user.role) ? (
                <IconButton color="primary" size="large" onClick={() => router.push('/app/users')}>
                    <GroupIcon />
                </IconButton>
            ) : null}
        </Box>
    )
}