import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Employee document added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
