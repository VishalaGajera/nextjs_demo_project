import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Bank shift updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
