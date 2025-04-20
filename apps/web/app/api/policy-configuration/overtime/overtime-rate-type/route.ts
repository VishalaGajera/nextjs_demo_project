import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Overtime rate type added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
