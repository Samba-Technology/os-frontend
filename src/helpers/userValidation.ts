import { Roles } from "@/models/user.model"

export function isAdmin(role: Roles) {
  if (role === Roles.ADMIN) {
    return true
  }
  return false
}

export function isUser(role: Roles) {
  if (role === Roles.ADMIN || Roles.USER) {
    return true
  }
  return false
}