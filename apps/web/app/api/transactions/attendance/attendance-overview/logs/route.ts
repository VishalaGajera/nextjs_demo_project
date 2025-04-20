import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Attendance log added successfully.",
      data: null,
    },
    { status: 200 }
  );
}
