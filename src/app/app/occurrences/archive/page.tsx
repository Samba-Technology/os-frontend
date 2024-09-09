"use client"
import OccurrencePaper from "../components/occurrence/OccurrencesPaper";

export default function ArchiveOccurrences() {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <OccurrencePaper title="Ocorrências arquivadas" isArchive={true} />
        </div>
    )
}