import api from "@/helpers/api";

export class StudentsService {
  public static findStudents(
    page?: number,
    limit?: number,
    queryStudent?: any
  ) {
    return api
      .get("/students", {
        params: {
          page: page,
          limit: limit,
          queryStudent: queryStudent,
        },
      })
      .then((response) => response.data);
  }

  public static create(
    ra: string,
    name: string,
    series: string,
    sclass: string
  ) {
    return api.post("/students", {
      ra: ra,
      name: name,
      series: series,
      sclass: sclass,
    });
  }

  public static edit(ra: string, name: string, series: string, sclass: string) {
    return api.post(`/students/${ra}`, {
      name: name,
      series: series,
      sclass: sclass,
    });
  }
}
