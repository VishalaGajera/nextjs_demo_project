import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank holiday group years retrieved successfully.",
      data: [
        {
          year: "2024",
        },
        {
          year: "2025",
        },
        {
          year: "2026",
        },
      ],
    },
    { status: 200 }
  );
}
export async function POST() {
  return NextResponse.json(
    {
      message: "Holidays added successfully.",
      data: null,
    },
    { status: 200 }
  );
}
