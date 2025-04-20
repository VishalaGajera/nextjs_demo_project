import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Designation retrieved successfully.",
      data: {
        id: "5830c768-0c6b-4334-aec3-b58a88a39649",
        company_id: "2ce7aac1-1bf4-4518-a3b7-53308afa1521",
        designation_code: "PRM",
        designation_name: "Project Reposter",
        description: "This is example of Project Reposter",
        is_active: true,
        company_name: "Tech Innovations Inc.1",
        action_by: "Demo",
        action_at: "2024-07-16T10:02:33.563Z",
      },
    },
    { status: 201 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Designation updated successfully.",
      data: {
        id: "5830c768-0c6b-4334-aec3-b58a88a39649",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        designation_name: "Project Reposter",
        designation_code: "PRM",
        description: "This is example of Project Reposter",
        is_active: true,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T10:01:53.097Z",
        updated_at: "2024-07-16T10:02:33.563Z",
        deleted_at: null,
      },
    },
    { status: 200 }
  );
}
export async function DELETE() {
  return NextResponse.json(
    {
      message: "Designation deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
