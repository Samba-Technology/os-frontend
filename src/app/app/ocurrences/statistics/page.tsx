"use client"
import { Ocurrence } from "@/models/ocurrence.model";
import { OcurrenceService } from "@/services/api/ocurrence.service";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface Visualization {
    title: string,
    value: number,
    porcentageChange?: number,
}

export default function OcurrencesStatistics() {
    const [ocurrences, setOcurrences] = useState<Ocurrence[]>([])
    const [months, setMonths] = useState<string[]>([])
    const [viewMonth, setViewMonth] = useState<string | undefined>(undefined)
    const [viewData, setViewData] = useState<Ocurrence[]>([])
    const [previousMonthData, setPreviousMonthData] = useState<Ocurrence[]>([])
    const [visualizationData, setVisualizationData] = useState<Visualization[] | null>(null)

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


                const monthsArray = Array.from(monthsSet);
                setMonths(Array.from(monthsSet));

                const recentMonth = monthsArray.pop();
                if (recentMonth) {
                    const recentMonthOccurrences = sortedOcurrences.filter((occurrence: Ocurrence) => {
                        const date = new Date(occurrence.createdAt);
                        const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                        return month === recentMonth;
                    });

                    setViewData(recentMonthOccurrences);
                    setViewMonth(recentMonth);

                    const previousMonth = monthsArray.pop();
                    if (previousMonth) {
                        const previousMonthOccurrences = sortedOcurrences.filter((occurrence: Ocurrence) => {
                            const date = new Date(occurrence.createdAt);
                            const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                            return month === previousMonth;
                        });

                        setPreviousMonthData(previousMonthOccurrences);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchOcurrences()
    }, [])

    useEffect(() => {
        const calculateStatistics = (data: Ocurrence[]) => {
            const total = data.length;
            const solved = data.filter((ocurrence: Ocurrence) => ocurrence.status === "RESOLVED").length;
            const canceled = data.filter((ocurrence: Ocurrence) => ocurrence.status === "CANCELED").length;
            const solvedPercentage = Math.round((100 * solved) / (total - canceled));

            return {
                total,
                solved,
                canceled,
                solvedPercentage,
            };
        }

        const viewStats = calculateStatistics(viewData);
        const prevStats = calculateStatistics(previousMonthData);

        const visualization = [
            {
                title: "Criadas",
                value: viewStats.total,
                percentageChange: prevStats.total ? ((viewStats.total - prevStats.total) / prevStats.total) * 100 : null
            },
            {
                title: "Resolvidas",
                value: viewStats.solved,
                percentageChange: prevStats.solved ? ((viewStats.solved - prevStats.solved) / prevStats.solved) * 100 : null
            },
            {
                title: "Canceladas",
                value: viewStats.canceled,
                percentageChange: prevStats.canceled ? ((viewStats.canceled - prevStats.canceled) / prevStats.canceled) * 100 : null
            },
            {
                title: "Resolvidas (%)",
                value: viewStats.solvedPercentage,
                percentageChange: prevStats.solvedPercentage ? ((viewStats.solvedPercentage - prevStats.solvedPercentage) / prevStats.solvedPercentage) * 100 : null
            }
        ];

        setVisualizationData(visualization);
    }, [viewData, previousMonthData]);

    return (
        <div className="flex w-full h-full justify-center items-center">
            <Paper elevation={4} className="flex flex-col p-4 gap-2 w-[90%] xl:w-2/3">
                <div className="flex justify-between">
                    <h1 className="text-2xl">Estatísticas das Ocorrências</h1>
                    <h1>{viewMonth}</h1>
                </div>
                <Autocomplete
                    fullWidth
                    options={months}
                    getOptionLabel={(option) => option}
                    onChange={(event, value: string | null) => {
                        if (value) {
                            const selectedMonthOccurrences = ocurrences.filter((occurrence: Ocurrence) => {
                                const date = new Date(occurrence.createdAt);
                                const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                                return month === value;
                            });
                            setViewData(selectedMonthOccurrences);
                            setViewMonth(value);

                            const [month, year] = value.split('/').map(Number);
                            const currentMonthDate = new Date(year, month - 1);

                            const previousMonthDate = new Date(currentMonthDate);
                            previousMonthDate.setMonth(currentMonthDate.getMonth() - 1);

                            const previousMonth = previousMonthDate.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');

                            const previousMonthOccurrences = ocurrences.filter((occurrence: Ocurrence) => {
                                const date = new Date(occurrence.createdAt);
                                const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                                return month === previousMonth;
                            });

                            setPreviousMonthData(previousMonthOccurrences);
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
                    {visualizationData != null && visualizationData.map((data: any, index) => (
                        <div key={index} className="flex flex-col items-center p-4 bg-neutral-50 drop-shadow-md rounded-md gap-2 w-full md:w-1/4">
                            <p className="md:text-sm 2xl:text-lg">{data.title}</p>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold text-xl md:text-2xl 2xl:text-4xl">{isNaN(data.value) ? 'N/A' : index === 3 ? data.value + "%" : data.value}</h1>
                                {data.percentageChange != null && (
                                    <p className={`text-sm ${data.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {data.percentageChange.toFixed(0)}%
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden gap-2 md:flex">
                    <div className="flex w-1/2 items-center flex-col bg-neutral-50 drop-shadow-md rounded-md p-4 gap-3">
                        <h1 className="text-xl">Ocorrências</h1>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: visualizationData ? (visualizationData[0].value - (visualizationData[1].value + visualizationData[2].value)) : 0, label: 'Abertas', color: '#bdbdbd' },
                                        { id: 1, value: visualizationData ? visualizationData[2].value : 0, label: 'Canceladas', color: '#757575' },
                                        { id: 2, value: visualizationData ? visualizationData[1].value : 0, label: 'Resolvidas', color: '#454545' },
                                    ],
                                    innerRadius: 10,
                                    outerRadius: 100,
                                    cornerRadius: 5,
                                    startAngle: 0,
                                    endAngle: 360,
                                    arcLabel: (item) => `${item.value != 0 ? item.value : ""}`,
                                },
                            ]}
                            sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                    fill: 'white',
                                },
                            }}
                            width={450}
                            height={200}
                        />
                    </div>
                    <div className="flex w-1/2 items-center flex-col bg-neutral-50 drop-shadow-md rounded-md p-4 gap-3">
                        <h1 className="text-xl">Porcentagem de Solução</h1>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: visualizationData ? (visualizationData[0].value - (visualizationData[1].value + visualizationData[2].value)) : 0, label: 'Não resolvidas', color: '#bdbdbd' },
                                        { id: 1, value: visualizationData ? visualizationData[1].value : 0, label: 'Resolvidas', color: '#757575' },
                                    ],
                                    innerRadius: 10,
                                    outerRadius: 100,
                                    cornerRadius: 5,
                                    startAngle: 0,
                                    endAngle: 360,
                                    arcLabel: (item) => `${item.value != 0 ? item.value : ""}`,
                                },
                            ]}
                            sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                    fill: 'white',
                                },
                            }}
                            width={450}
                            height={200}
                        />
                    </div>
                </div>
            </Paper>
        </div>
    )
}