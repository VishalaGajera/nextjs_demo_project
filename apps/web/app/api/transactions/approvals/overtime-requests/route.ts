import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bulk overtime request approval added successfully.",
      data: null,
    },
    { status: 201 }
  );
}
