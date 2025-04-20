import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Weekly off types retrieved successfully.",
      data: [
        {
          value: "b8b4c7c5-a750-4033-9e16-c605cd2aa7fb",
          label: "Sunday Weekly Off",
        },
      ],
    },
    { status: 200 }
  );
}
