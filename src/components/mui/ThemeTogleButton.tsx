import { ThemeContext } from "@/contexts/theme/themeContext"
import { Box, Tooltip } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useContext } from "react"

export const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Box className="flex items-center gap-2 cursor-pointer" onClick={toggleTheme} color="inherit">
            <Tooltip title="Alterar tema">
                {theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </Tooltip>
        </Box>
    )
} 