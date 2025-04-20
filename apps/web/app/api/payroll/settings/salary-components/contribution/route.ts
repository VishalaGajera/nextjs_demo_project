import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Contribution component added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
