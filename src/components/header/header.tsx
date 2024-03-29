import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AuthContext from "@/contexts/auth";
import { isAdmin } from "@/helpers/authorization";
import ArchiveIcon from '@mui/icons-material/Archive';
import IconCodeSandbox from "../icons/logo";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const router = useRouter()
    const { user, signed } = useContext(AuthContext)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box component="div" className="flex items-center h-[80px] w-full justify-between gap-10 px-16">
            <Box component="div" className="flex justify-center gap-3">
                <IconCodeSandbox fontSize="50px" />
                <div className="hidden lg:flex gap-3">
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Typography variant="overline" fontSize="20px" fontWeight="bold">Samba Technology</Typography>
                </div>
            </Box>
            {signed && (
                <>
                    <Box component="div" className="hidden gap-6 items-center lg:flex">
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
                    </Box>
                    <Box component="div" className="flex lg:hidden">
                        <IconButton onClick={handleClick}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            elevation={0}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem className="flex gap-2" onClick={() => router.push('/app/ocurrences/archive')}>
                                <ArchiveIcon />
                                Arquivadas
                            </MenuItem>
                            <MenuItem className="flex gap-2" onClick={() => router.push('/app/ocurrences')}>
                                <DescriptionIcon />
                                Ocorrências
                            </MenuItem>
                            {!!user && isAdmin(user.role) ? (
                                <MenuItem className="flex gap-2" onClick={() => router.push('/app/users')}>
                                    <GroupIcon />
                                    Usuários
                                </MenuItem>
                            ) : null}
                            <Divider />
                            <MenuItem className="flex gap-2" onClick={() => {
                                localStorage.removeItem("access-token");
                                window.location.reload()
                            }}>
                                <LogoutIcon />
                                Sair
                            </MenuItem>
                        </Menu>
                    </Box>
                </>
            )}
        </Box>
    )
}