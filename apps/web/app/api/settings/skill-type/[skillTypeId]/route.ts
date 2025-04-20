import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Skill type retrieved successfully.",
      data: {
        id: "bc07baea-f5e6-41cb-be02-100b4cd1bafe",
        company_id: "2ce7aac1-1bf4-4518-a3b7-53308afa1521",
        skill_type_code: "HSKL12",
        skill_type_name: "Highly Skilled12",
        description: "Highly skilled worker1",
        is_active: true,
        company_name: "Tech Innovations Inc.1",
        action_by: "Demo",
        action_at: "2024-07-16T10:11:51.207Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Skill type updated successfully.",
      data: {
        id: "bc07baea-f5e6-41cb-be02-100b4cd1bafe",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        skill_type_name: "Highly Skilled12",
        skill_type_code: "HSKL12",
        description: "Highly skilled worker1",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T10:11:10.301Z",
        updated_at: "2024-07-16T10:11:51.207Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Skill type deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
