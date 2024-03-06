import { Student } from "./student.model"
import { User } from "./user.model"

export type Ocurrence = {
    id: number,
    description: string,
    level: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    students: Student[],
    users: User,
    responsible: User
}