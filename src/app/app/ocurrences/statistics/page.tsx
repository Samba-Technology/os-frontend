"use client"
import { Ocurrence } from "@/models/ocurrence.model";
import { OcurrenceService } from "@/services/api/ocurrence.service";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function OcurrencesStatistics() {
    const [ocurrences, setOcurrences] = useState<Ocurrence[]>([])
    const [months, setMonths] = useState<string[]>([])
    const [viewMonth, setViewMonth] = useState<string | undefined>(undefined)
    //const [users, setUser] = useState<User[]>([])
    const [viewData, setViewData] = useState<Ocurrence[]>([])
    const [visualizationData, setVisualizationData] = useState<any[]>([])

    useEffect(() => {
        const fetchOcurrences = async () => {
            try {
                const oResponse = await OcurrenceService.findOcurrences(1, 500, false);
                const aOResponse = await OcurrenceService.findOcurrences(1, 500, true);

                const combined = oResponse.data.concat(aOResponse.data);
                const sortedOcurrences = combined.sort((a: any, b: any) => a.id - b.id)

                setOcurrences(sortedOcurrences);

                const monthsSet = new Set<string>();
                sortedOcurrences.forEach((ocurrence: Ocurrence) => {
                    const date = new Date(ocurrence.createdAt);
                    const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                    monthsSet.add(month);
                });

                setMonths(Array.from(monthsSet))

                const recentMonth = Array.from(monthsSet).pop();
                const recentMonthOccurrences = sortedOcurrences.filter((occurrence: Ocurrence) => {
                    const date = new Date(occurrence.createdAt);
                    const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                    return month === recentMonth;
                });

                setViewData(recentMonthOccurrences);
                setViewMonth(recentMonth);
            } catch (e) {
                console.error(e);
            }
        }

        fetchOcurrences()
    }, [])

    useEffect(() => {
        const total = viewData.length
        const solved = viewData.filter((ocurrence: Ocurrence) => ocurrence.status === "RESOLVED").length
        const canceled = viewData.filter((ocurrence: Ocurrence) => ocurrence.status === "CANCELED").length
        const solvedPercentage = Math.round((100 * solved) / (total - canceled))

        const visualization = [
            {
                title: "Ocorrências criadas",
                value: total
            },
            {
                title: "Ocorrências resolvidas",
                value: solved
            },
            {
                title: "Ocorrências canceladas",
                value: canceled
            },
            {
                title: "Porcentagem de solução",
                value: solvedPercentage + "%"
            }
        ]

        setVisualizationData(visualization)
    }, [viewData])

    return (
        <div className="flex w-full h-full justify-center items-center">
            <Paper elevation={4} className="flex flex-col w-2/3 p-4 gap-2">
                <div className="flex justify-between">
                    <h1 className="text-2xl">Estatísticas</h1>
                    <h1>{viewMonth}</h1>
                </div>
                <Autocomplete
                    fullWidth
                    options={months}
                    getOptionLabel={(option) => option}
                    onChange={(event, value: string | null) => {
                        if (value) {
                            console.log(value)
                            const selectedMonthOccurrences = ocurrences.filter((occurrence: Ocurrence) => {
                                const date = new Date(occurrence.createdAt);
                                const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                                return month === value;
                            });
                            setViewData(selectedMonthOccurrences);
                            setViewMonth(value);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Pesquisa por mês"
                        />
                    )}
                />
                <div className="flex flex-col gap-2 md:flex-row">
                    {visualizationData ? visualizationData.map((data: any, index) => (
                        <div key={index} className="flex flex-col items-center p-4 bg-neutral-200 rounded-md gap-2 w-full md:w-1/4">
                            <p className="md:text-lg">{data.title}</p>
                            <h1 className="text-4xl font-semibold">{data.value}</h1>
                        </div>
                    )) : null}
                </div>
            </Paper>
        </div>
    )
}