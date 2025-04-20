import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Overtime rate type retrieved successfully.",
      data: {
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        overtime_rate_name: "Standard Overtime1s",
        overtime_rate_code: "OT0",
        description: "Special overtime rate for work on holidays.",
        overtime_type: "fixed_ot",
        custom_ot: null,
        fixed_ot: 33.0,
      },
    },
    { status: 201 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Overtime rate types updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Overtime rate types deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
