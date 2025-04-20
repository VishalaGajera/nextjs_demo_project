import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Education detail added successfully.",
      data: {
        id: "484c4ecf-84d1-49e3-a16f-c583b609d76c",
        employee_id: "1e44d23a-04c7-44c3-a53c-a86a73a94f7c",
        qualification: "bachelors_degree",
        institute: "GTU",
        from_date: "2016-08-24T18:30:00.000Z",
        to_date: "2020-08-24T18:30:00.000Z",
        percentage_or_grade: "80%",
        qualification_area: "Engineering",
        is_active: true,
        is_deleted: false,
        created_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        updated_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        deleted_by: null,
        created_at: "2024-08-07T03:10:23.844Z",
        updated_at: "2024-08-07T03:10:23.844Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}
