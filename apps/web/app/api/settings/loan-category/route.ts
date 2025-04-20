import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Loan category added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
