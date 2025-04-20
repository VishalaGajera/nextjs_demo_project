import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Past work employment added successfully.",
      data: {
        id: "e865deb3-e46e-41c5-98bb-6312e9585bed",
        employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
        company_name: "Tech Innovators Inc.",
        designation: "Senior Software Engineer",
        from_date: "2018-05-01T00:00:00.000Z",
        to_date: "2022-04-30T00:00:00.000Z",
        address: "123 Innovation Drive, Tech City, CA 94016",
        leaving_reason: "Better Career Opportunity",
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-08-16T11:34:37.269Z",
        updated_at: "2024-08-16T11:34:37.269Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}
