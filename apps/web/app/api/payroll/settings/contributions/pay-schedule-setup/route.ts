import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Pay schedule setup group added successfully.",
      data: null,
    },
    { status: 200 }
  );
}
