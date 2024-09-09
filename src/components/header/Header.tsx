import { Box, Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AuthContext from "@/contexts/authContext";
import { isAdmin } from "@/helpers/authorization";
import ArchiveIcon from '@mui/icons-material/Archive';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { ThemeToggleButton } from "../mui/ThemeTogleButton";
import Image from "next/image";
import GroupsIcon from '@mui/icons-material/Groups';

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
        <Box component="div" className="flex items-center w-full justify-between gap-10 px-6 py-2 lg:px-16">
            <Box component="div" className="flex justify-center gap-3">
                <Tooltip className="cursor-pointer" title="Copyright © 2024 Samba Code">
                    <Image
                        src="/logo.png"
                        width={60}
                        height={60}
                        alt="Samba Code Logo"
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </Tooltip>
            </Box>
            <div className="flex gap-4">
                <ThemeToggleButton />
                {signed && (
                    <>
                        <Box component="div" className="hidden gap-6 items-center lg:flex">
                            <Box component="div" className="flex items-center gap-5">
                                <Box className="cursor-pointer" onClick={() => router.push('/app/students')}>
                                    <Tooltip title="Estudantes">
                                        <GroupsIcon />
                                    </Tooltip>
                                </Box>
                                <Box className="cursor-pointer" onClick={() => router.push('/app/occurrences/archive')}>
                                    <Tooltip title="Ocorrências arquivadas">
                                        <ArchiveIcon />
                                    </Tooltip>
                                </Box>
                                <Box className="cursor-pointer" onClick={() => router.push('/app/occurrences')}>
                                    <Tooltip title="Ocorrências em aberto">
                                        <DescriptionIcon />
                                    </Tooltip>
                                </Box>
                                {!!user && isAdmin(user.role) ? (
                                    <>
                                        <div className="cursor-pointer" onClick={() => router.replace('/app/occurrences/statistics')}>
                                            <Tooltip title="Estatísticas de ocorrências">
                                                <AnalyticsIcon />
                                            </Tooltip>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => router.replace('/app/users')}>
                                            <Tooltip title="Gestão de usuários">
                                                <GroupIcon />
                                            </Tooltip>
                                        </div>
                                    </>
                                ) : null}
                                <IconButton onClick={() => {
                                    localStorage.removeItem("access-token");
                                    window.location.reload()
                                }}>
                                    <Tooltip title="Sair">
                                        <LogoutIcon fontSize="small" />
                                    </Tooltip>
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
                                <MenuItem className="flex gap-2" onClick={() => router.push('/app/occurrences/archive')}>
                                    <ArchiveIcon />
                                    Arquivadas
                                </MenuItem>
                                <MenuItem className="flex gap-2" onClick={() => router.push('/app/occurrences')}>
                                    <DescriptionIcon />
                                    Ocorrências
                                </MenuItem>
                                {!!user && isAdmin(user.role) ? [
                                    <MenuItem key="stats" className="flex gap-2" onClick={() => router.push('/app/occurrences/statistics')}>
                                        <AnalyticsIcon />
                                        Estatísticas
                                    </MenuItem>,
                                    <MenuItem key="users" className="flex gap-2" onClick={() => router.push('/app/users')}>
                                        <GroupIcon />
                                        Usuários
                                    </MenuItem>
                                ] : null}
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
            </div>
        </Box>
    )
}