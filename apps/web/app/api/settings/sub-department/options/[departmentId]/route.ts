import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Sub-departments retrieved successfully.",
      data: [
        {
          value: "73610caf-de30-4e12-8d8e-844ec56bb159",
          label: "Technical Support",
        },
        {
          value: "ae40a887-1262-4153-bf3a-38c2cd302b24",
          label: "Quality Assurance",
        },
        {
          value: "cf510123-df2a-4e1a-8cfc-b8213f15dda8",
          label: "System Analysis",
        },
      ],
    },
    { status: 200 }
  );
}
