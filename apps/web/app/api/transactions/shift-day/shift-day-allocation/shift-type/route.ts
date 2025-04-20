import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "shift type updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
