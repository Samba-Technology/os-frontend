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
}