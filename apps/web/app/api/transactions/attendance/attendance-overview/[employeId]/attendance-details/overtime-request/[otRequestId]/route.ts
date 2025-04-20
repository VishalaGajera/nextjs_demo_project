import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee shift, logs and work hours retrieved successfully.",
      data: {
        id: "30b71c81-8532-46a1-9780-e0dbf3008ddc",
        employee_name: "Jay JK kyada",
        avatar:
          "https://sixtify.s3.amazonaws.com/1732883450754_profile-icon-white-background_941097-162371.avif",
        overtime_date: "2025-01-06",
        remark: "testing",
        day_type: "holiday", // "holiday", "first_half_weekly_off", "second_half_weekly_off", "full_day_weekly_off"  , working_day
        shift_type_id: "818d8886-af2f-4e82-a658-331624e15608",
        shift_type_name: "DAY",
        shift_start: "09:30:00+00",
        shift_end: "18:30:00+00",
        first_in_time: "2024-08-25T09:24:00+00:00",
        last_out_time: "2024-08-25T13:30:45+00:00",
        work_hours: "08:00:00",
        work_in_time_overtime: "07:00:00.000Z",
        work_out_time_overtime: "20:00:00.000Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee overtime request updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
