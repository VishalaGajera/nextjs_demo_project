import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Business locations retrieved successfully.",
      data: [
        {
          value: "c08d2574-2a1a-40d1-baf5-35fbedc2a6c5",
          label: "Apple Solutions",
        },
        {
          value: "08341f7a-f51c-46a5-9ce3-f05f80a2c500",
          label: "Microsoft Corp.",
        },
      ],
    },
    { status: 200 }
  );
}
