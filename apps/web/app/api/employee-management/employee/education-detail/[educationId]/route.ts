import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee education detail retrieved successfully.",
      data: {
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
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee education detail updated successfully.",
      data: {
        id: "6d48363d-937f-4f77-a9d0-9c62f9fabea4",
        employee_id: "1e44d23a-04c7-44c3-a53c-a86a73a94f7c",
        qualification: "ssc",
        institute: "Central High School",
        from_date: "2010-03-31T18:30:00.000Z",
        to_date: "2012-03-30T18:30:00.000Z",
        percentage_or_grade: "80%",
        qualification_area: "Commerce",
        is_active: true,
        is_deleted: false,
        created_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        updated_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        deleted_by: null,
        created_at: "2024-08-07T03:50:43.692Z",
        updated_at: "2024-08-07T04:22:15.404Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Employee education detail deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
