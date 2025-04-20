import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "PT group listed successfully.",
      data: {
        totalCount: 1,
        ptGroups: [
          {
            id: "248495e8-f2b0-4a7a-910d-cabef650fe65",
            state_name: "Maharashtra",
            deduction_cycle_type: "half_yearly",
            action_by: "Demo Demo",
            action_at: "2025-01-31T08:56:24.673Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 201 }
  );
}
