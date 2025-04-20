import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee overtime request is enabled.",
      data: {
        is_overtime_request_enabled: true,
      },
    },
    { status: 200 }
  );
}
