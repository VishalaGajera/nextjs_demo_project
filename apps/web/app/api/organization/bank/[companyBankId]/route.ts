import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Company bank retrieved successfully.",
      data: {
        id: "36a9fd10-0cfe-4e1a-9d84-f44c82925bc6",
        company_id: "0f5ec58c-a0b5-4918-8e02-d10205b5b414",
        company_name: "codezee",
        bank_id: "4b32c428-117c-4242-a53c-09839602375c",
        bank_name: "Savings Bank",
        branch_name: "KORMANGALAA",
        ifsc_code: "HDFC0001234",
        account_no: "6543210987654321",
        action_by: "Demo",
        action_at: "2024-07-16T09:45:30.446Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Company bank updated successfully.",
      data: {
        id: "36a9fd10-0cfe-4e1a-9d84-f44c82925bc6",
        company_id: "0f5ec58c-a0b5-4918-8e02-d10205b5b414",
        bank_id: "4b32c428-117c-4242-a53c-09839602375c",
        branch_name: "KORMANGALAA",
        ifsc_code: "HDFC0001234",
        account_no: "6543210987654321",
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T09:44:36.039Z",
        updated_at: "2024-07-16T09:45:30.446Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Company Bank deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
