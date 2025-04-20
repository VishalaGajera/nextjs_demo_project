import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Reset Instruction sent successfully",
      data: {},
    },
    { status: 200 }
  );
}
