"use client"
import api from "@/helpers/api";
import { User } from "@/models/user.model";
import { AuthService } from "@/services/api/auth.service";
import { UsersService } from "@/services/api/users.service";
import { createContext, useEffect, useState } from "react";

type LoginData = {
  email: string;
  password: string;
}

type AuthContextData = {
  signed: boolean;
  login({ email, password }: LoginData): Promise<void>;
  user: User | undefined;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function UserVerification() {
      const accessToken = localStorage.getItem('access-token')

      if (accessToken) {
        api.defaults.headers.common["Authorization"] = 'Bearer ' + accessToken
        await FetchUserData();
      }
      setLoading(false)
    }

    UserVerification()
  }, [])

  const FetchUserData = async () => {
    try {
      const user = await UsersService.findMe()
      setUser(user)
    } catch (error) {
      console.error(error)
      localStorage.removeItem('access-token')
    }
  }

  const login = async ({ email, password }: LoginData) => {
    const response = await AuthService.login(email, password)
    localStorage.setItem("access-token", response.accessToken)
    api.defaults.headers.common["Authorization"] = 'Bearer ' + response.accessToken

    await FetchUserData()
  }

  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, login, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext