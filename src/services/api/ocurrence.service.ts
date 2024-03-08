import api from "@/helpers/api"
import { Student } from "@/models/student.model"

export class OcurrenceService {
    public static create(description: string, level: string, students: Student[]) {
        return api.post('/ocurrences', {
            description: description,
            level: level,
            students: students
        }).then(response => response.data)
    }

    public static findOcurrences(page: number, limit: number, isArchive: boolean) {
        return api.get('/ocurrences', {
            params: {
                page: page,
                limit: limit,
                isArchive: isArchive.toString()
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