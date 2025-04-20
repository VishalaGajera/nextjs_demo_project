import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Overtime rule retrieved successfully.",
      data: [
        {
          value: "9533dee4-567b-4b85-8436-b67fa2610d82",
          label: "Hr",
        },
        {
          value: "bf2dd1e0-1feb-410c-b2c1-84a67c062290",
          label: "only employees",
        },
        {
          value: "72359dc1-03c2-433c-b370-39868199e65a",
          label: "only EMPLOYEE",
        },
        {
          value: "7bb867d3-3877-4320-9edf-8082baabc484",
          label: "employee",
        },
        {
          value: "f6e40870-857c-44c8-b622-2133c82b6f1a",
          label: "only employees",
        },
      ],
    },
    { status: 200 }
  );
}
