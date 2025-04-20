import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Employee education detail listed successfully.",
      data: {
        totalCount: 4,
        employeeEducations: [
          {
            id: "b7ed402c-c286-4450-8da0-12f27a6ce461",
            qualification: "bachelors_degree",
            institute: "Stanford University",
            from_date: "2014-08-31T18:30:00.000Z",
            to_date: "2018-06-29T18:30:00.000Z",
            percentage_or_grade: "88%",
            qualification_area: "Electrical Engineering",
            is_active: true,
            is_deleted: false,
            action_by: "Jenish Chanchad",
            action_at: "2024-08-07T05:23:10.382Z",
            full_count: "4",
          },
          {
            id: "6d48363d-937f-4f77-a9d0-9c62f9fabea4",
            qualification: "ssc",
            institute: "Central High School",
            from_date: "2010-03-31T18:30:00.000Z",
            to_date: "2012-03-30T18:30:00.000Z",
            percentage_or_grade: "80%",
            qualification_area: "Commerce",
            is_active: true,
            is_deleted: false,
            action_by: "Jenish Chanchad",
            action_at: "2024-08-07T10:19:54.281Z",
            full_count: "4",
          },
          {
            id: "f6fff1b2-82ed-4848-9040-188059a37653",
            qualification: "diploma",
            institute: "Harvard University",
            from_date: "2017-01-14T18:30:00.000Z",
            to_date: "2019-12-14T18:30:00.000Z",
            percentage_or_grade: "90%",
            qualification_area: "Data Science",
            is_active: true,
            is_deleted: false,
            action_by: "Jenish Chanchad",
            action_at: "2024-08-07T03:50:28.549Z",
            full_count: "4",
          },
          {
            id: "484c4ecf-84d1-49e3-a16f-c583b609d76c",
            qualification: "bachelors_degree",
            institute: "GTU",
            from_date: "2016-08-24T18:30:00.000Z",
            to_date: "2020-08-24T18:30:00.000Z",
            percentage_or_grade: "80%",
            qualification_area: "Engineering",
            is_active: true,
            is_deleted: false,
            action_by: "Jenish Chanchad",
            action_at: "2024-08-07T03:10:23.844Z",
            full_count: "4",
          },
        ],
      },
    },
    { status: 200 }
  );
}
