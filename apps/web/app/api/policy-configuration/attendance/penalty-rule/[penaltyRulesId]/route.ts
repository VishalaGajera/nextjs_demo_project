import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Attendance penalty rules retrieved successfully.",
      data: {
        id: "767db438-5680-4d17-9128-c4bf4c8c0128",
        company_id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
        company_name: "Cmcreation Pvt Ltd",
        attendance_penalty_rule_code: "MG",
        attendance_penalty_rule_name: "Manager Group",
        buffer_period_days: 2,
        is_holiday_penalty_enabled: true,
        holiday_penalty_condition: {
          condition_type: "sandwich",
          leave_deduction_days: 1,
          days_with_no_attendance: 2,
          penalty_deduction_source: "loss_of_pay",
        },
        is_weekly_off_penalty_enabled: true,
        weekly_off_penalty_condition: {
          condition_type: "sandwich",
          leave_deduction_days: 1,
          days_with_no_attendance: 2,
          penalty_deduction_source: "loss_of_pay",
        },
        is_late_arrival_penalty_enabled: true,
        late_arrival_penalty_condition: {
          penalty_basis: "hour",
          evaluation_period: "month",
          penalty_slabs: [
            {
              late_from_minutes: 10,
              late_to_minutes: 30,
              penalty_deduction_minutes: 10,
            },
          ],
        },
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Attendance penalty rules updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Attendance penalty rule deleted successfully",
      data: null,
    },
    { status: 200 }
  );
}
