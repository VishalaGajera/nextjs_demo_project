import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Companies fetched successfully.",
      data: [
        {
          value: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
          label: "codezee",
        },
      ],
    },
    { status: 200 }
  );
}
