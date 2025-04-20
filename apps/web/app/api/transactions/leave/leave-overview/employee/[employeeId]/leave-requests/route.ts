import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Leave Request added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
