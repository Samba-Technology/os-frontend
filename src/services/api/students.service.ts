import api from "@/helpers/api"
import { Student } from "@/models/student.model"

export class StudentsService {
    public static findStudents(): Promise<Student[]> {
        return api.get('/students').then(response => response.data)
    }

    public static create(ra: string, name: string, series: string, sclass: string) {
        return api.post('/students', {
            ra: ra,
            name: name,
            series: series,
            sclass: sclass,
        })
    }
}