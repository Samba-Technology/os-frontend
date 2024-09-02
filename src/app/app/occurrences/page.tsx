"use client"
import { Box } from "@mui/material";
import OcurrencePaper from "./components/occurrence/occurrencePaper";

export default function Occurrences() {
    return (
        <Box className="flex h-full w-full justify-center items-center">
            <OcurrencePaper title="Ocorrências em aberto" isArchive={false}/>
        </Box>
    )
}