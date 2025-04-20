import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave plans retrieved successfully.",
      data: [
        {
          value: "73610caf-de30-4e12-8d8e-844ec56bb159",
          label: "Leave Plan 205",
        },
        {
          value: "ae40a887-1262-4153-bf3a-38c2cd302b24",
          label: "Codezee Leave Plan",
        },
        {
          value: "cf510123-df2a-4e1a-8cfc-b8213f15dda8",
          label: "Public Leaves",
        },
      ],
    },
    { status: 200 }
  );
}
