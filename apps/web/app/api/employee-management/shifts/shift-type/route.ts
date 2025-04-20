import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Shift type added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
