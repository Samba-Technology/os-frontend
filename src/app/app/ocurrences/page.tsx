"use client"
import { Box } from "@mui/material";
import OcurrencePaper from "./components/ocurrence/ocurrencePaper";

export default function Ocurrences() {
    return (
        <Box className="flex h-full w-full justify-center items-center">
            <OcurrencePaper title="Ocorrências em aberto" isArchive={false}/>
        </Box>
    )
}