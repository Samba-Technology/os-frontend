import { Ocurrence } from "./occurrence.model";

export type User = {
  id: number
  name: string;
  email: string;
  role: Roles;
  ocurrences: Ocurrence[]
}

export enum Roles {
  ADMIN,
  USER
}