import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bank shift type added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
