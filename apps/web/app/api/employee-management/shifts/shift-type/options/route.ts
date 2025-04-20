import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Shift types retrieved successfully.",
      data: [
        {
          value: "eeaa23e4-6f6e-4b9b-8a93-31e5727a7197",
          label: "Second Half",
        },
        {
          value: "721443e8-b19b-4162-81f7-af79c20a0e00",
          label: "Full Day",
        },
      ],
    },
    { status: 200 }
  );
}
