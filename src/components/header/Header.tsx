import { Box, Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AuthContext from "@/contexts/authContext";
import { isAdmin } from "@/helpers/userValidation";
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

    const items = [
        {
            name: "Estudantes",
            icon: <GroupsIcon />,
            URL: "/app/students",
            onlyAdmin: false
        },
        {
            name: "Ocorrências arquivadas",
            icon: <ArchiveIcon />,
            URL: "/app/occurrences/archive",
            onlyAdmin: false
        },
        {
            name: "Ocorrências em aberto",
            icon: <DescriptionIcon />,
            URL: "/app/occurrences",
            onlyAdmin: false
        },
        {
            name: "Estatísticas",
            icon: <AnalyticsIcon />,
            URL: "/app/occurrences/statistics",
            onlyAdmin: true
        },
        {
            name: "Usuários",
            icon: <GroupIcon />,
            URL: "/app/users",
            onlyAdmin: true
        }
    ]

    return (
        <Box component="div" className="flex items-center w-full justify-between gap-10 px-6 py-2 lg:px-16">
            <Box component="div" className="flex justify-center gap-3">
                <a target="_blank" href="https://sambacode.com.br" >
                    <Image
                        src="/logo.png"
                        width={60}
                        height={60}
                        alt="Samba Code Logo"
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </a>
            </Box>
            <div className="flex gap-4">
                <ThemeToggleButton />
                {signed && (
                    <>
                        <Box component="div" className="hidden gap-6 items-center lg:flex">
                            <Box component="div" className="flex items-center gap-5">
                                {items.map((item, index) => {
                                    if (!!user && item.onlyAdmin && !isAdmin(user.role)) return null

                                    return (
                                        <div key={index} className="cursor-pointer" onClick={() => router.replace(item.URL)}>
                                            <Tooltip title={item.name}>
                                                {item.icon}
                                            </Tooltip>
                                        </div>
                                    )
                                })}
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
                                {items.map((item, index) => {
                                    if (!!user && item.onlyAdmin && !isAdmin(user.role)) return null

                                    return (
                                        <MenuItem key={index} className="flex gap-2" onClick={() => router.push(item.URL)}>
                                            {item.icon}
                                            {item.name}
                                        </MenuItem>
                                    )
                                })}
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