import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Pay schedule setup group listed successfully.",
      data: {
        totalCount: 2,
        payScheduleGroups: [
          {
            id: "32b67e76-735b-4f85-a955-b08be4f4d0ab",
            company_name: "Cmcreation Pvt Ltd",
            pay_schedule_group_name: "pay schdule name",
            frequency: "monthly",
            end_day_of_month: 28,
            action_by: "Demo Demo",
            action_at: "2025-01-31T08:50:41.277Z",
            full_count: "2",
          },
          {
            id: "830b3894-04fb-4cf8-bc73-2377f19d9ffa",
            company_name: "Cmcreation Pvt Ltd",
            pay_schedule_group_name: "pay schdule namee",
            frequency: "monthly",
            end_day_of_month: 28,
            action_by: "Demo Demo",
            action_at: "2025-01-31T08:51:06.157Z",
            full_count: "2",
          },
        ],
      },
    },
    { status: 201 }
  );
}
