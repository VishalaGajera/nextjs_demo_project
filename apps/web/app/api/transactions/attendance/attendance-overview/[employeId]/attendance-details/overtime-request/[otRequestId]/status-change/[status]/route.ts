import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee overtime request status updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
