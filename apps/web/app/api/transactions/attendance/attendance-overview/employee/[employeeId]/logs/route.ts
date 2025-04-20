import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee Attendance log retrieved successfully.",
      data: {
        id: "fdcda08b-bfad-4399-9ab6-d6ef4788b058",
        employee_name: "Akshay Vinubhai Gondaliya (HI67NAL)",
        shift_type_id: "aa228731-6912-4e4d-b586-64f1d44a7ca0",
        shift_type_name: "DAY",
        shift_start: "04:00:00+00",
        shift_end: "13:00:00+00",
        status: "holiday",
        slot_start: "23:30:00+00",
        slot_end: "23:29:59+00",
        logs: {
          manual: [],
          machine: [],
        },
      },
    },
    { status: 200 }
  );
}
