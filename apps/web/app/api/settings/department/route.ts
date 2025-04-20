import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Department added successfully.",
      data: {
        id: "96d86eb1-94b0-471f-bb0f-36fe5dd93f77",
        company_id: "816a2506-91c6-4b23-841d-cd174e42a074",
        department_code: "SM1",
        department_name: "Sales and Marketing1",
        description: "This is Accounting department.",
        is_active: false,
        company_name: "CMCREATION PVT LTD",
        action_by: "Jenish Chanchad",
        action_at: "2024-07-11T12:18:00.528Z",
        full_count: "28",
      },
    },
    { status: 201 }
  );
}
