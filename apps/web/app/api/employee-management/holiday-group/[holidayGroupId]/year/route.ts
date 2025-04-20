import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    {
      message: "Holiday group added successfully.",
      data: null,
    },
    { status: 200 }
  );
}
export function GET() {
  return NextResponse.json(
    {
      message: "Holiday group years listed successfully.",
      data: {
        years: [2024, 2023, 2022],
      },
    },
    { status: 200 }
  );
}
