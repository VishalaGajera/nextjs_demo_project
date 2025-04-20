import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Shift planner updated successfully.",
      data: null,
    },
    { status: 201 }
  );
}
