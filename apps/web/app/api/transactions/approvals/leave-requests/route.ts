import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Bulk leave request approval update successfully.",
      data: null,
    },
    { status: 201 }
  );
}
