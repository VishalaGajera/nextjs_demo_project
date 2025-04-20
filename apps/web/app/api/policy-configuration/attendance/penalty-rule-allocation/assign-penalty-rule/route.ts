import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Attendance penalty rule assigned successfully.",
      data: null,
    },
    { status: 200 }
  );
}
