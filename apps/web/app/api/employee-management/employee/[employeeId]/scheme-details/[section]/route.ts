import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee scheme details updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
