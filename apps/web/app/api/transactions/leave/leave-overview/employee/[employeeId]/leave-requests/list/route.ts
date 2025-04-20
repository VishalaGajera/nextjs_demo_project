import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Leave Requests Listed successfully",
      data: {
        totalCount: 1,
        list: [
          {
            id: "08bf6dc5-c838-4b4d-b4dd-dd3d67bf64c8",
            from_date: "2024-12-14T18:30:00.000Z",
            to_date: "2024-12-14T18:30:00.000Z",
            from_half: "first_half",
            to_half: "second_half",
            reason: "meri marzi",
            status: "pending",
            leave_type: "paid",
            leave_type_name: "Family and Medical Leave",
            applied_by: "Demo Demo",
            applied_at: "2025-01-13T12:21:19.638Z",
            action_reason: null,
            action_by: "Demo Demo",
            action_at: "2025-01-13T12:21:19.638Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
