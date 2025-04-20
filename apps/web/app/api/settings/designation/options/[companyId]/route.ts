import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Designations retrieved successfully.",
      data: [
        {
          value: "1562d7ed-ab67-4cdd-89c0-d7756b46fa02",
          label: "Team Leader",
        },
        {
          value: "4721bd77-e045-48ef-919f-a16aa84a7150",
          label: "Business Analyst",
        },
        {
          value: "cff25106-ebcc-47b3-9091-9197d8f63dc5",
          label: "Software Engineer",
        },
        {
          value: "ca5ea7bc-a2ae-414e-beff-f3f74a4475f9",
          label: "HR Manager",
        },
      ],
    },
    { status: 200 }
  );
}
