import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Sub caste added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
