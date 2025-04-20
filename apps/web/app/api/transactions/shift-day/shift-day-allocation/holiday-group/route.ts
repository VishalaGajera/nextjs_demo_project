import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Holiday group updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
