import { Ocurrence } from "./ocurrence.model";

export type User = {
  id: number
  name: string;
  email: string;
  role: string;
  ocurrences: Ocurrence[]
}