import { Ocurrence } from "./occurrence.model"

export type Student = {
    ra: string,
    name: string,
    class: string,
    occurrences: Ocurrence[]
}