import api from "@/helpers/api"

export class UsersService {
    public static create(name: string, email: string, password: string) {
        return api.post('/users', {
            name: name,
            email: email,
            password: password
        })
    }

    public static findMe() {
        return api.get('/users/me').then(response => response.data)
    }

    public static findUsers(page: number, limit: number) {
        return api.get('/users', {
            params: {
                page: page,
                limit: limit
            }
        }).then(response => response.data)
    }
}