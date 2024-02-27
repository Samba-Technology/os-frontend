import api from "@/helpers/api"

export class UsersService {
    public static create(name: string, email: string, password: string) {
        return api.post('/users', {
            name: name,
            email: email,
            password: password
        })
    }
}