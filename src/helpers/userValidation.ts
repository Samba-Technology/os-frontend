import { Roles } from "@/models/user.model"

export function isAdmin(role: Roles) {
  if (role === Roles.Admin) {
    return true
  }
  return false
}

export function isUser(role: Roles) {
  if (role === Roles.Admin || Roles.User) {
    return true
  }
  return false
}