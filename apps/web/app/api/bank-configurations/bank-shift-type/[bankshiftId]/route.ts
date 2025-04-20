import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank shift type retrieved successfully.",
      data: {
        id: "519a86a2-5f45-4b51-b615-828e669a82a4",
        company_id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
        bank_shift_type_name: "Accounting - Flex Week Shift",
        bank_shift_type_code: "ACC_FLX",
        description:
          "This shift applies to the Accounting department with flexible work hours. Sundays and Mondays have alternating full and half-day offs, while other days follow a flexible schedule. Break times are also flexible to accommodate workloads.",
        company_name: "Cmcreation Pvt Ltd",
        action_by: "Demo Demo",
        action_at: "2024-09-24T11:31:49.673Z",
        timings: {
          friday: {
            shift_end: "17:00:00",
            shift_start: "09:00:00",
          },
          monday: {
            shift_end: "16:00:00",
            shift_start: "08:00:00",
          },
          sunday: {
            shift_end: "13:00:00",
            shift_start: "09:00:00",
          },
          tuesday: {
            shift_end: "17:00:00",
            shift_start: "09:00:00",
          },
          saturday: {
            shift_end: "14:00:00",
            shift_start: "10:00:00",
          },
          thursday: {
            shift_end: "16:00:00",
            shift_start: "08:00:00",
          },
          wednesday: {
            shift_end: "17:30:00",
            shift_start: "09:30:00",
          },
        },
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Bank shift type updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
