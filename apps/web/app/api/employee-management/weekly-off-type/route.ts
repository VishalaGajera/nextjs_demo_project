import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Weekly Off added successfully.",
      data: null,
    },
    { status: 200 }
  );
}
