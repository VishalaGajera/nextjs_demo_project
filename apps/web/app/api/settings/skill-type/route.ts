import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Skill type added successfully.",
      data: {
        id: "bc07baea-f5e6-41cb-be02-100b4cd1bafe",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        skill_type_name: "Highly Skilled12",
        skill_type_code: "HSKL12",
        description: "Highly skilled worker",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T10:11:10.301Z",
        updated_at: "2024-07-16T10:11:10.301Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}
