import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank shift types retrieved successfully.",
      data: [
        {
          value: "3f51af8b-29fd-4170-850f-12adfe572fa8",
          label: "Day Shift",
          shift_start: "08:00:00+00",
          shift_end: "16:00:00+00",
        },
        {
          value: "db404b32-4d5f-42fe-816f-91e3c693d4df",
          label: "General Shift",
          shift_start: "21:30:00+00",
          shift_end: "21:30:00+00",
        },
      ],
    },
    { status: 200 }
  );
}
