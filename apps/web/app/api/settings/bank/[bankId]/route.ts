import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank retrieved successfully.",
      data: {
        id: "b70521d1-0565-49b6-b63c-83a31c786372",
        bank_code: "NEW1234567890",
        bank_name: "New Bank Name",
        description: "Secondary bank account",
        is_active: true,
        action_by: "Demo",
        action_at: "2024-07-16T08:46:12.424Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Bank updated successfully.",
      data: {
        id: "b70521d1-0565-49b6-b63c-83a31c786372",
        bank_name: "New Bank Name",
        bank_code: "NEW1234567890",
        description: "Secondary bank account",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T08:45:34.866Z",
        updated_at: "2024-07-16T08:46:12.424Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Bank deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
