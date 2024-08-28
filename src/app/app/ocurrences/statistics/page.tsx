"use client"
import { Ocurrence } from "@/models/ocurrence.model";
import { OcurrenceService } from "@/services/api/ocurrence.service";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { Autocomplete, Box, Paper, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { User } from "@/models/user.model";
import { UsersService } from "@/services/api/users.service";
import { Student } from "@/models/student.model";
import { StudentsService } from "@/services/api/students.service";
import AuthContext from "@/contexts/authContext";
import { isAdmin } from "@/helpers/authorization";
import { useRouter } from "next/navigation";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';

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
    const [page, setPage] = useState(0)
    const [users, setUsers] = useState<User[]>([])
    const [viewUsers, setViewUsers] = useState<User[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [viewStudents, setViewStudents] = useState<Student[]>([])
    const [viewClasses, setViewClasses] = useState<any>([])

    const { user } = useContext(AuthContext)
    const router = useRouter()

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

                    const classCount: { [key: string]: number } = {};

                    recentMonthOccurrences.forEach((occurrence: Ocurrence) => {
                        occurrence.students.forEach((student: Student) => {
                            const className = student.class;
                            classCount[className] = (classCount[className] || 0) + 1;
                        });
                    });

                    const sortedClasses = Object.entries(classCount)
                        .sort((a, b) => b[1] - a[1])
                        .map(([className, count]) => ({ className, count }));

                    setViewClasses(sortedClasses);

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

        if (user && !isAdmin(user.role)) {
            router.push("/app/ocurrences")
        } else {
            fetchOcurrences()
        }
    }, [router, user])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const uResponse: { data: User[] } = await UsersService.findUsers();
                setUsers(uResponse.data)

                const nMonths = months.slice()
                const recentMonth = nMonths.pop()
                if (recentMonth) {
                    const recentMonthUsers = uResponse.data.map((user: User) => {
                        const ocurrences = user.ocurrences.filter((ocurrence: Ocurrence) => {
                            const date = new Date(ocurrence.createdAt);
                            const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                            return month === recentMonth;
                        });
                        return { user, ocurrencesCount: ocurrences.length };
                    })
                        .filter(({ ocurrencesCount }) => ocurrencesCount > 0)
                        .sort((a, b) => b.ocurrencesCount - a.ocurrencesCount)
                        .map(({ user }) => user);

                    setViewUsers(recentMonthUsers);
                }
            } catch (e) {
                console.error(e)
            }
        }

        const fetchStudents = async () => {
            try {
                const sResponse = await StudentsService.findStudents()
                setStudents(sResponse)

                const nMonths = months.slice()
                const recentMonth = nMonths.pop()
                if (recentMonth) {
                    const recentMonthStudents = sResponse.map((student: Student) => {
                        const ocurrences = student.ocurrences.filter((ocurrence: Ocurrence) => {
                            const date = new Date(ocurrence.createdAt);
                            const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                            return month === recentMonth;
                        });
                        return { student, ocurrencesCount: ocurrences.length };
                    })
                        .filter(({ ocurrencesCount }) => ocurrencesCount > 0)
                        .sort((a, b) => b.ocurrencesCount - a.ocurrencesCount)
                        .map(({ student }) => student);

                    setViewStudents(recentMonthStudents);
                }
            } catch (e) {
                console.error(e)
            }
        }


        fetchStudents()
        fetchUsers()
    }, [months])

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
                percentageChange: prevStats.total ? ((viewStats.total - prevStats.total) / prevStats.total) * 100 : null,
                icon: <LibraryAddIcon color="primary" />
            },
            {
                title: "Resolvidas",
                value: viewStats.solved,
                percentageChange: prevStats.solved ? ((viewStats.solved - prevStats.solved) / prevStats.solved) * 100 : null,
                icon: <LibraryAddCheckIcon color="success" />
            },
            {
                title: "Canceladas",
                value: viewStats.canceled,
                percentageChange: prevStats.canceled ? ((viewStats.canceled - prevStats.canceled) / prevStats.canceled) * 100 : null,
                icon: <ErrorIcon color="warning" />
            },
            {
                title: "Resolvidas (%)",
                value: viewStats.solvedPercentage,
                percentageChange: prevStats.solvedPercentage ? ((viewStats.solvedPercentage - prevStats.solvedPercentage) / prevStats.solvedPercentage) * 100 : null,
                icon: <CheckCircleIcon color="info" />
            }
        ];

        setVisualizationData(visualization);
    }, [viewData, previousMonthData]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setPage(newValue)
    }

    return (
        <div className="flex w-full h-full justify-center items-center">
            <Paper elevation={4} className="flex flex-col p-4 gap-3 w-[90%]">
                <div className="flex justify-between">
                    <h1 className="text-lg md:text-xl 2xl:text-2xl">Estatísticas das Ocorrências</h1>
                    <h1>{viewMonth}</h1>
                </div>
                <div className="flex flex-row gap-2 md:justify-between">
                    <Autocomplete
                        className="w-1/2 md:w-1/3"
                        options={months}
                        getOptionLabel={(option) => option}
                        onChange={(event, value: string | null, reason) => {
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

                                const selectedMonthUsers = users.map((user: User) => {
                                    const ocurrences = user.ocurrences.filter((ocurrence: Ocurrence) => {
                                        const date = new Date(ocurrence.createdAt);
                                        const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                                        return month === value;
                                    });
                                    return { user, ocurrencesCount: ocurrences.length };
                                })
                                    .filter(({ ocurrencesCount }) => ocurrencesCount > 0)
                                    .sort((a, b) => b.ocurrencesCount - a.ocurrencesCount)
                                    .map(({ user }) => user);

                                const classCount: { [key: string]: number } = {};

                                selectedMonthOccurrences.forEach((occurrence: Ocurrence) => {
                                    occurrence.students.forEach((student: Student) => {
                                        const className = student.class;
                                        classCount[className] = (classCount[className] || 0) + 1;
                                    });
                                });

                                const sortedClasses = Object.entries(classCount)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([className, count]) => ({ className, count }));

                                const selectedMonthStudents = students.map((student: Student) => {
                                    const ocurrences = student.ocurrences.filter((ocurrence: Ocurrence) => {
                                        const date = new Date(ocurrence.createdAt);
                                        const month = date.toLocaleDateString('default', { month: '2-digit', year: 'numeric' }).replace('/', '/');
                                        return month === value;
                                    });
                                    return { student, ocurrencesCount: ocurrences.length };
                                })
                                    .filter(({ ocurrencesCount }) => ocurrencesCount > 0)
                                    .sort((a, b) => b.ocurrencesCount - a.ocurrencesCount)
                                    .map(({ student }) => student);

                                setViewClasses(sortedClasses);
                                setViewStudents(selectedMonthStudents);
                                setViewUsers(selectedMonthUsers);
                                setPreviousMonthData(previousMonthOccurrences);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                
                                label="Pesquisa por mês"
                                color="primary"
                            />
                        )}
                    />
                    <Tabs value={page} onChange={handleChange}>
                        <Tooltip title="Ocorrências">
                            <Tab icon={<DescriptionIcon />} />
                        </Tooltip>
                        <Tooltip title="Professores/Alunos">
                            <Tab icon={<GroupIcon />} />
                        </Tooltip>
                    </Tabs>
                </div>
                {page === 0 ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 md:flex-row">
                            {visualizationData != null && visualizationData.map((data: any, index) => (
                                <Paper elevation={2} key={index} className="flex flex-col items-center p-4 drop-shadow-md rounded-md gap-3 w-full md:w-1/4">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="md:text-sm 2xl:text-lg">{data.title}</p>
                                        <p>{data.icon} </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-semibold text-xl md:text-2xl 2xl:text-4xl">{isNaN(data.value) ? 'N/A' : index === 3 ? data.value + "%" : data.value}</h1>
                                        {data.percentageChange != null && (
                                            <p className={`text-sm ${data.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {data.percentageChange.toFixed(0)}%
                                            </p>
                                        )}
                                    </div>
                                </Paper>
                            ))}
                        </div>
                        <div className="hidden gap-2 md:flex">
                            <Paper elevation={2} className="flex w-1/2 items-center flex-col bg-neutral-50 drop-shadow-md rounded-md p-4 gap-3">
                                <h1 className="text-xl">Ocorrências</h1>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: visualizationData ? (visualizationData[0].value - (visualizationData[1].value + visualizationData[2].value)) : 0, label: 'Abertas', color: '#5e9cff' },
                                                { id: 1, value: visualizationData ? visualizationData[2].value : 0, label: 'Canceladas', color: '#267aff' },
                                                { id: 2, value: visualizationData ? visualizationData[1].value : 0, label: 'Resolvidas', color: '#024abd' },
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
                            </Paper>
                            <Paper elevation={2} className="flex w-1/2 items-center flex-col bg-neutral-50 drop-shadow-md rounded-md p-4 gap-3">
                                <h1 className="text-xl">Porcentagem de Solução</h1>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: visualizationData ? (visualizationData[0].value - (visualizationData[1].value + visualizationData[2].value)) : 0, label: 'Não resolvidas', color: '#5e9cff' },
                                                { id: 1, value: visualizationData ? visualizationData[1].value : 0, label: 'Resolvidas', color: '#024abd' },
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
                            </Paper>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 md:flex-row text-base md:h-[300px]">
                        <Paper className="flex flex-col items-center drop-shadow-md gap-1 p-4 w-full md:w-1/3">
                            <div className="flex justify-between items-center w-full">
                                <h1 className="text-xl">Professores</h1>
                                <SchoolIcon color="info" />
                            </div>
                            <div className="flex flex-col gap-1 overflow-y-auto p-2 w-full">
                                {viewUsers.map((user: User, index) => (
                                    <Paper elevation={3} key={index} className="flex p-2 bg-neutral-100 w-full justify-between">
                                        <p>{user.name}</p>
                                        <p>{viewData.filter((ocurrence: Ocurrence) => ocurrence.userId === user.id).length}</p>
                                    </Paper>
                                ))}
                            </div>
                        </Paper>
                        <Paper className="flex flex-col items-center drop-shadow-md gap-1 p-4 w-full md:w-1/3">
                            <div className="flex justify-between items-center w-full">
                                <h1 className="text-xl">Estudantes</h1>
                                <PersonIcon color="info" />
                            </div>
                            <div className="flex flex-col gap-1 overflow-y-auto p-2 w-full">
                                {viewStudents.map((student: Student, index) => (
                                    <Paper elevation={3} key={index} className="flex p-2 bg-neutral-100 w-full justify-between">
                                        <p>{student.name.length > 25 ? `${student.name.substring(0, 25)}...` : student.name} ({student.class})</p>
                                        <p>{viewData.reduce((count, ocurrence: Ocurrence) => {
                                            if (ocurrence.students.some(s => s.ra === student.ra)) {
                                                return count + 1;
                                            }

                                            return count;
                                        }, 0)}</p>
                                    </Paper>
                                ))}
                            </div>
                        </Paper>
                        <Paper className="flex flex-col items-center drop-shadow-md gap-1 p-4 w-full md:w-1/3">
                            <div className="flex justify-between items-center w-full">
                                <h1 className="text-xl">Séries</h1>
                                <GroupIcon color="info" />
                            </div>
                            <div className="flex flex-col gap-1 overflow-y-auto p-2 w-full">
                                {viewClasses.map((c: any, index: any) => (
                                    <Paper elevation={3} key={index} className="flex p-2 bg-neutral-100 w-full justify-between">
                                        <p>{c.className}</p>
                                        <p>{c.count}</p>
                                    </Paper>
                                ))}
                            </div>
                        </Paper>
                    </div>
                )
                }
            </Paper >
        </div >
    )
}