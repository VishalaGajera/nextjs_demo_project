import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Bank shift type listed successfully.",
      data: {
        totalCount: 1,
        bankShiftTypes: [
          {
            id: "ebc6293e-5ae9-47d0-bb11-9e9bf0ef5f2f",
            bank_shift_type_name: "POP TESTING",
            bank_shift_type_code: "POP",
            shift_start: "03:30:00+00",
            shift_end: "12:30:00+00",
            shift_hours: "09:00:00",
            break_hours: "01:00:00",
            effective_work_hours: "8:00:00",
            company_name: "POPULAR INDUSTRIES",
            action_by: "Chirag Sondagar",
            action_at: "2024-11-27T08:52:58.851Z",
            full_count: "15",
          },
        ],
      },
    },
    { status: 200 }
  );
}
