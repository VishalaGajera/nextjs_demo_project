import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Attendance penalty rule added successfully.",
      data: null,
    },
    { status: 200 }
  );
}
