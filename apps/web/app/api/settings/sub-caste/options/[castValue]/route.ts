import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "sub-castes retrieved successfully.",
      data: [
        {
          value: "72ff42de-8b0c-486b-9539-a0581a7a973a",
          label: "patel",
        },
      ],
    },
    { status: 200 }
  );
}
