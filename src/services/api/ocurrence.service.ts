import api from "@/helpers/api"

export class OcurrenceService {
    public static create(description: string, level: string, students: string[]) {
        return api.post('/ocurrences', {
            description: description,
            level: level,
            students: students
        }).then(response => response.data)
    }

    public static findOcurrences(page: number, limit: number, isArchive: boolean, queryStudent?: string, queryUser?: number) {
        return api.get('/ocurrences', {
            params: {
                page: page,
                limit: limit,
                isArchive: isArchive.toString(),
                queryStudent: queryStudent,
                queryUser: queryUser
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
}