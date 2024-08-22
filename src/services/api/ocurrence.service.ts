import api from "@/helpers/api"

export class OcurrenceService {
    public static create(description: string, level: string, students: string[], tutors: number[]) {
        return api.post('/ocurrences', {
            description: description,
            level: level,
            students: students,
            tutors: tutors
        }).then(response => response.data)
    }

    public static edit(id: number, description: string, level: string, students: string[], tutors: number[]) {
        return api.post(`/ocurrences/edit/${id}`, {
            description: description,
            level: level,
            students: students,
            tutors: tutors
        }).then(response => response.data)
    }

    public static findOcurrences(page: number, limit: number, isArchive: boolean, queryStudent?: string, queryUser?: number, queryClass?: string) {
        return api.get('/ocurrences', {
            params: {
                page: page,
                limit: limit,
                isArchive: isArchive.toString(),
                queryStudent: queryStudent,
                queryUser: queryUser,
                queryClass: queryClass
            },
        }).then(response => response.data)
    }

    public static assume(id: number) {
        return api.put(`/ocurrences/${id}`).then(response => response.data)
    }

    public static dispatch(id: number, dispatch: string) {
        return api.post(`/ocurrences/${id}`, {
            dispatch: dispatch
        })
    }

    public static conclue(id: number) {
        return api.delete(`/ocurrences/${id}`).then(response => response.data)
    }

    public static cancel(id: number) {
        return api.delete(`/ocurrences/cancel/${id}`).then(response => response.data)
    }
}