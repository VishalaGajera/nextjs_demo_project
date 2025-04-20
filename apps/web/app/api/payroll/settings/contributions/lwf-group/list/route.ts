import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "LWF group listed successfully.",
      data: {
        totalCount: 2,
        lwfGroups: [
          {
            id: "1ef4cbaa-4591-46be-bb47-2c1c944a0222",
            state_name: "Maharashtra",
            deduction_months: [12, 5, 3, 2],
            deduction_cycle_type: "half_yearly",
            contribution_start_month: 5,
            action_by: "Demo Demo",
            action_at: "2025-01-23T10:03:14.148Z",
            full_count: "1",
          },
          {
            id: "94103287-b15c-42f6-8bc9-840bedc70f86",
            state_name: "Gujarat",
            deduction_months: [2, 8, 3, 9],
            deduction_cycle_type: "monthly",
            contribution_start_month: 5,
            action_by: "Demo test",
            action_at: "2025-01-23T10:03:14.148Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 201 }
  );
}
