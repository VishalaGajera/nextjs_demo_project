import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bank added successfully.",
      data: {
        id: "b70521d1-0565-49b6-b63c-83a31c786372",
        bank_name: "Savings Bank",
        bank_code: "SAV6789012345",
        description: "Bank account for savings",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T08:45:34.866Z",
        updated_at: "2024-07-16T08:45:34.866Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}
