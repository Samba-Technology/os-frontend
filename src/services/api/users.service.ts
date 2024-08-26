import api from "@/helpers/api"

export class UsersService {
    public static create(name: string, email: string, password: string) {
        return api.post('/users', {
            name: name,
            email: email,
            password: password
        })
    }

    public static edit(userId: string, name: string, email: string, password: string) {
        return api.post(`/users/${userId}`, {
            name: name,
            email: email,
            password: password
        })
    }

    public static findMe() {
        return api.get('/users/me').then(response => response.data)
    }

    public static findUsers(page?: number, limit?: number, queryUser?: any) {
        return api.get('/users', {
            params: {
                page: page,
                limit: limit,
                queryUser: queryUser
            }
        }).then(response => response.data)
    }

    public static delete(id: string) {
        return api.delete(`/users/${id}`).then(response => response.data)
    }
}