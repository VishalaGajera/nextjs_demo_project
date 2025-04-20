import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bank shift pattern created successfully",
      data: null,
    },
    { status: 200 }
  );
}
