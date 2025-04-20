import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Leave type added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
