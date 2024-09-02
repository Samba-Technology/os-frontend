"use client"
import { Box } from "@mui/material";
import OccurrencePaper from "./components/occurrence/occurrencePaper";

export default function Occurrences() {
    return (
        <Box className="flex h-full w-full justify-center items-center">
            <OccurrencePaper title="Ocorrências em aberto" isArchive={false}/>
        </Box>
    )
}