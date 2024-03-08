export enum UserRoles {
  Admin = 'ADMIN',
  User = 'USER',
}

export function isAdmin(role: String) {
  if (role === UserRoles.Admin) {
    return true
  }
  return false
}

export function isUser(role: String) {
  if (role === UserRoles.User || role === UserRoles.Admin) {
    return true
  }
  return false
}