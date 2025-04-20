import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Loan retrieved successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Loan updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Loan deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
