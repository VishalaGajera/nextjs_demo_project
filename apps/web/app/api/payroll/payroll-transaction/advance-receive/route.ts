import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Advance receive added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
