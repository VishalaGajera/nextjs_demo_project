import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Sub-department retrieved successfully.",
      data: {
        id: "6a8f73cc-cefa-41ff-9ae4-f9bcd8d23676",
        department_id: "e4dd0d8b-dad3-4268-9c0e-b7089aba1a52",
        company_id: "2ce7aac1-1bf4-4518-a3b7-53308afa1521",
        sub_department_code: "SM",
        sub_department_name: "Software Manager",
        description: "This is the Software Manager",
        is_active: false,
        department_name: "dxsz",
        company_name: "Tech Innovations Inc.1",
        action_by: "Demo",
        action_at: "2024-07-16T09:57:59.625Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Sub-department updated successfully.",
      data: {
        id: "a4903c4f-35a1-477c-ab1c-6cf841c611ea",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        department_id: "0cf33ba7-61dc-4b3c-b2d0-80a1b3090092",
        sub_department_name: "Software Manager",
        sub_department_code: "SM",
        description: "This is the Software Manager",
        is_active: false,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T09:57:13.436Z",
        updated_at: "2024-07-16T09:57:59.625Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Sub-department deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
