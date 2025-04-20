import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holiday years retrieved successfully.",
      data: [
        {
          label: "2024",
          value: 2024,
        },
        {
          label: 2025,
          value: "2025",
        },
      ],
    },
    { status: 200 }
  );
}
