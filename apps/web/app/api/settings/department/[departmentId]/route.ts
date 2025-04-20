import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Department fetched successfully.",
      data: {
        id: "b8f5dbb0-df3e-4a44-a735-6a3df456a6db",
        company_id: "6a8f73cc-cefa-41ff-9ae4-f9bcd8d23676",
        department_code: "HR8",
        department_name: "HR8",
        description: "test bhavikdfhdfhfhfdsgfsdg",
        is_active: true,
        company_name: "Tech Solutions Inc",
        action_by: "Bhavik",
        action_at: "2024-06-03T07:01:44.730Z",
        full_count: "28",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Department updated successfully.",
      data: {
        id: "96d86eb1-94b0-471f-bb0f-36fe5dd93f77",
        company_id: "e8036f4a-fa62-48a8-94c1-f6c01bd33a1b",
        department_code: "SM1",
        department_name: "Sales and Marketing1",
        description: "This is Accounting department.",
        is_active: false,
        company_name: "Indina Pvt Ltd",
        action_by: "Jenish Chanchad",
        action_at: "2024-07-11T12:18:00.528Z",
        full_count: "28",
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Department deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
