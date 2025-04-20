import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Shift types retrieved successfully.",
      data: [
        {
          value: "e2c4f6f7-ce60-4a89-b122-4c0dc9c9a4ea",
          label: "NIGHT",
          shift_start: "20:00:00+00",
          shift_end: "05:30:00+00",
        },
        {
          value: "9b0108da-5c21-47f9-9126-730b03ade418",
          label: "DAY",
          shift_start: "20:30:00+00",
          shift_end: "18:30:00+00",
        },
      ],
    },
    { status: 200 }
  );
}
