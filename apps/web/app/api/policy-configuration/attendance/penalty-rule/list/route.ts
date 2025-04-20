import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Attendance penalty rule listed successfully",
      data: {
        totalCount: 1,
        attendancePenaltyRules: [
          {
            id: "62990593-afe1-444b-9c7e-6fd3ec991235",
            company_name: "Codezee Solutions PVT Ltd.",
            attendance_penalty_rule_code: "BWHC",
            attendance_penalty_rule_name: "based on work hours config",
            action_by: "Demo Demo",
            action_at: "2024-11-27T11:37:13.682Z",
            full_count: "2",
          },
        ],
      },
    },
    { status: 201 }
  );
}
