import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Employee overtime request listed successfully.",
      data: {
        totalCount: 1,
        overtimeRequests: [
          {
            id: "fdcda08b-bfad-4399-9ab6-d6ef4788b058",
            overtime_date: "2025-01-03",
            requested_by: "Jay JK kyada",
            requested_date: "2024-11-30T03:10:09.000Z",
            in_time_overtime: "02:00:00.000Z",
            out_time_overtime: "20:00:00.000Z",
            remark: "test",
            status: "pending",
            approval_by: "Prem Patel",
            approval_at: "2024-12-05T03:10:09.000Z",
            next_approver: ["Mahesh", "Kanti", "Pritesh"],
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
