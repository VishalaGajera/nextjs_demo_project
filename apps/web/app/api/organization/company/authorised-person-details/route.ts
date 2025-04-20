import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Director added successfully.",
    data: null,
  });
}
