import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "ESIC groups retrieved successfully.",
      data: [
        {
          value: "ff25b981-a33f-43a1-bdc0-4d1271614441",
          label: "group name",
        },
        {
          value: "595c8f64-6117-427a-8823-0c031a19259b",
          label: "group name asd",
        },
      ],
    },
    { status: 200 }
  );
}
