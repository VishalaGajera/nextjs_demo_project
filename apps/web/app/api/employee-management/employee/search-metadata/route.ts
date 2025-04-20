import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee draft total count retrieved successfully.",
      data: {
        draftCount: "10",
      },
    },
    { status: 200 }
  );
}
