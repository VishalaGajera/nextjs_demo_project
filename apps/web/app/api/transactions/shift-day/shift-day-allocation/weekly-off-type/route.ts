import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Weekly off type updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
