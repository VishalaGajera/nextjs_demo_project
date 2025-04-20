import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bank pay schedule group listed successfully.",
      data: {
        totalCount: 1,
        BankPayScheduleGroups: [
          {
            company_name: "Codezee",
            description: "Bank pay schedule",
            month_year: "2025-01",
            weekly_off: "sunday",
            month_days: 31,
            payable_days: 27,
            total_weekly_off: 4,
            total_holiday: 2,
            action_by: "Demo Demo",
            action_at: "2025-02-20T11:37:13.682Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
