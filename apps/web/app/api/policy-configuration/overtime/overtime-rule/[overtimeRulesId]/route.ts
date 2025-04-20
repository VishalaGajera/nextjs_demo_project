import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Overtime rule retrieved successfully.",
      data: {
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        overtime_rule_name: "only employee",
        overtime_rule_code: "ONLYEM",
        overtime_base_calculation: "effective_work_hours", // effective_work_hours, gross_hours
        is_working_day_enabled: true,
        is_weekly_off_enabled: true,
        is_holiday_enabled: false,
        is_round_off: true,
        round_off_minutes: 5,
        round_off_to: "round_off_nearest", // round_off_nearest , round_up_to, round_down_to
        working_day: {
          is_employee_paid_overtime_enabled: true,
          calculation_unit_type: "hours", // hours, day
          hours_compensation: "after_shift_end", // all_hours, before_shift_start, after_shift_end
          paid_overtime_criteria: [
            {
              id: "36ffce6b-fef6-447b-a4c6-19789bd790ff",
              overtime_start_minutes: 30,
              overtime_end_minutes: 102,
              overtime_rate_type_id: "ec2441e0-57a2-4e08-878f-66b8869bf560",
            },
            {
              id: "36ffce6b-fef6-447b-a4c6-19789bd790ff",
              overtime_start_minutes: 250,
              overtime_end_minutes: 325,
              overtime_rate_type_id: "ec2441e0-57a2-4e08-878f-66b8869bf560",
            },
          ],
          is_overtime_min_time_enabled: true,
          minimum_in_time_overtime_duration_minutes: 20,
        },
        weekly_off_day: {
          is_employee_paid_overtime_enabled: true,
          calculation_unit_type: "day", // hours, day
          hours_compensation: "before_shift_start", // all_hours, before_shift_start, after_shift_end
          paid_overtime_criteria: [
            {
              id: "36ffce6b-fef6-447b-a4c6-19789bd790ff",
              overtime_start_minutes: 30,
              overtime_end_minutes: 102,
              overtime_rate_type_day: 1.5,
            },
          ],
          is_overtime_min_time_enabled: false,
        },
      },
    },
    { status: 200 }
  );
}
