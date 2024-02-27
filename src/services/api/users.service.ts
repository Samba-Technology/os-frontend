import api from "@/helpers/api"

export class UsersService {
    public static create(email: string, password: string) {
        return api.post('/users', {
            email: email,
            password: password
        })
    }
}