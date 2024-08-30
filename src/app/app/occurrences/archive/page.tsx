"use client"
import OcurrencePaper from "../components/occurrence/occurrencePaper";

export default function ArchiveOcurrences() {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <OcurrencePaper title="Ocorrências arquivadas" isArchive={true} />
        </div>
    )
}