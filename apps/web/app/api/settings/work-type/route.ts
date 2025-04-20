import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Work type added successfully.",
      data: {
        id: "a6948f39-804b-4ce1-a6a9-119f6ba2b7d0",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        work_type_name: "Part-Time1",
        work_type_code: "PA1",
        description: "Part-Time",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T10:08:32.951Z",
        updated_at: "2024-07-16T10:08:32.951Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}
