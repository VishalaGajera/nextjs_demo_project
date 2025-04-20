import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Leave type deleted successfully.",
      data: null,
    },
    { status: 201 }
  );
}
