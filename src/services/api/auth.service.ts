import api from "@/helpers/api"

type LoginResponse = {
    accessToken: string
}

export class AuthService {
    public static login(email: string, password: string): Promise<LoginResponse> {
        return api.post('/auth/login', {
            email: email,
            password: password
        }).then(response => response.data)
    }
}