import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank holidays retrieved successfully",
      data: [
        {
          holiday_date: "2026-01-13T18:30:00.000Z",
          holiday_name: "MkarSankranti",
        },
        {
          holiday_date: "2026-01-25T18:30:00.000Z",
          holiday_name: "Republic Day",
        },
      ],
    },
    { status: 200 }
  );
}
