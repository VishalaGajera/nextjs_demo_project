import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Holiday deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Holiday updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
