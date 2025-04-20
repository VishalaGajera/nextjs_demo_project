import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bulk attendance log added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
