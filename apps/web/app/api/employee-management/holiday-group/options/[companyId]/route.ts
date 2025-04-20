import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holiday groups retrieved successfully.",
      data: [
        {
          value: "a28dbb09-43b4-43b8-98ff-c91b109df505",
          label: "Default Holiday",
        },
      ],
    },
    { status: 200 }
  );
}
