import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holiday retrieved successfully.",
      data: {
        holiday_name: "Makar Sankranti",
        holiday_date: "2026-01-13T18:30:00.000Z",
        is_editable: false,
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Bank holiday updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Holiday deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
