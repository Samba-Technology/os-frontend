import api from "@/helpers/api"
import { Student } from "@/models/student.model"

export class StudentsService {
    public static findStudents(): Promise<Student[]> {
        return api.get('/students').then(response => response.data)
    }
}