import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Earning component added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
