import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({
    statusCode: 200,
    message: "Weekly Off deleted successfully.",
    data: {},
  });
}
