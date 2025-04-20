import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Work type retrieved successfully.",
      data: {
        id: "a6948f39-804b-4ce1-a6a9-119f6ba2b7d0",
        company_id: "2ce7aac1-1bf4-4518-a3b7-53308afa1521",
        work_type_code: "PA1",
        work_type_name: "Part-Time1",
        description: "Part-Time1",
        is_active: true,
        company_name: "Tech Innovations Inc.1",
        action_by: "Demo",
        action_at: "2024-07-16T10:09:24.067Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Work type updated successfully.",
      data: {
        id: "a6948f39-804b-4ce1-a6a9-119f6ba2b7d0",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        work_type_name: "Part-Time1",
        work_type_code: "PA1",
        description: "Part-Time1",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T10:08:32.951Z",
        updated_at: "2024-07-16T10:09:24.067Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Work type deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
