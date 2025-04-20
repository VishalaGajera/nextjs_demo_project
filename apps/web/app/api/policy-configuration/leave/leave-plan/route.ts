import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Leave plan added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
