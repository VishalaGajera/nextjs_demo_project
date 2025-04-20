import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Attendance penalty rule employees listed successfully.",
      data: {
        totalCount: 2,
        list: [
          {
            id: "a41738f3-bfc0-4a52-a56b-63fb27f187e0",
            avatar: null,
            employee_name: "Testing",
            department_name: "Development",
            sub_department_name: "Frontend",
            designation_name: "Team Lead",
            reporting_manager_name: "Manav Pandav",
            attendance_penalty_rule_name: "Manager Group",
            full_count: "1",
          },
          {
            id: "a41738f3-bfc0-4a52-a56b-63fb27f187e7",
            avatar: null,
            employee_name: "Jaimish test Raval",
            department_name: "CASTING",
            sub_department_name: "CASTING",
            designation_name: "PRODUCTION SUPERVISOR",
            reporting_manager_name: "Manav Pandav",
            attendance_penalty_rule_name: "Manager Group",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
