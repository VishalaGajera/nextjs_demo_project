import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave plan retrived successfully.",
      data: {
        id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        company_id: "a387f51d-23a5-44ca-b633-4d3ed32e68d0",
        leave_plan_name: "Codezee - 2025",
        year_start_month: 2,
        description: "Codezee Web Leave Plan",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Leave plan updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Leave plan deleted successfully.",
      data: null,
    },
    { status: 201 }
  );
}
