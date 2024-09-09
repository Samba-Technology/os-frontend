"use client"
import { Box } from "@mui/material";
import OccurrencesPaper from "./components/occurrence/OccurrencesPaper";

export default function Occurrences() {
    return (
        <Box className="flex h-full w-full justify-center items-center">
            <OccurrencesPaper title="Ocorrências em aberto" isArchive={false}/>
        </Box>
    )
}