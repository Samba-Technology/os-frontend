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

    public static findOcurrences(page: number, limit: number) {
        return api.get('/ocurrences', {
            params: {
                page: page,
                limit: limit
            }
        }).then(response => response.data)
    }
}