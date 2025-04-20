import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee codes retrieved successfully.",
      data: {
        employee_next_code: "HI109NAL",
      },
    },
    { status: 200 }
  );
}
