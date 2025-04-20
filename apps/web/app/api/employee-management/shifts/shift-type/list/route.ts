import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Shift type listed successfully.",
      data: {
        totalCount: 3,
        shiftTypes: [
          {
            id: "3dc390bd-d3a4-4334-b00a-10822a693003",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            shift_type_name: "shift five",
            shift_type_code: "SHIFT_544",
            shift_start: "07:29:00+00",
            shift_end: "16:30:00+00",
            shift_gross_hours: "09:00:00",
            break_gross_hours: "0:30:00",
            min_full_day_hours: "08:30:00",
            min_half_day_hours: "04:30:00",
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-24T11:09:36.012Z",
            full_count: "5",
          },
          {
            id: "a9758ed3-25bd-47e2-9531-6b1e73dad3a3",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            shift_type_name: "Amery Rice",
            shift_type_code: "NAM SIT VOLUPTATES",
            shift_start: "08:00:00+00",
            shift_end: "16:30:00+00",
            shift_gross_hours: "09:30:00",
            break_gross_hours: "01:30:00",
            min_full_day_hours: "08:30:00",
            min_half_day_hours: "04:30:00",
            company_name: "Codezee Solutions PVT Ltd.",
            action_by: "Demo Demo",
            action_at: "2024-09-24T06:35:27.436Z",
            full_count: "5",
          },
          {
            id: "b46886e0-2f3f-4f0a-9d94-13dca6971fa4",
            company_id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
            shift_type_name: "Accounting - Flex Week Shift",
            shift_type_code: "ACC_FLX",
            shift_start: "08:00:00+00",
            shift_end: "16:30:00+00",
            shift_gross_hours: "09:30:00",
            break_gross_hours: "01:30:00",
            min_full_day_hours: "08:30:00",
            min_half_day_hours: "04:30:00",
            company_name: "Cmcreation Pvt Ltd",
            action_by: "Demo Demo",
            action_at: "2024-09-24T05:48:36.942Z",
            full_count: "5",
          },
        ],
      },
    },
    { status: 200 }
  );
}
