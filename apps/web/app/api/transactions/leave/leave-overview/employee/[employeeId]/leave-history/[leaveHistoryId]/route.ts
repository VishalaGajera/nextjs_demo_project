import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave history item retrieved successfully.",
      data: {
        id: "30b71c81-8532-46a1-9780-e0dbf3008ddc",
        avatar:
          "https://sixtify.s3.amazonaws.com/1723805168303_depositphotos_675471232-stock-illustration-lion-king-wild-roars-majestic_1715750732604 - Copy.jpg",
        leave_start: "2024-11-22T11:37:13.682Z",
        leave_end: "2024-11-25T11:37:13.682Z",
        leave_days: "3 Days",
        leave_type: "Unpaid",
        leave_name: "Sick leave",
        request_by: "Demo Demo",
        request_at: "2024-11-27T11:37:13.682Z",
        leave_remark: "On leave due to illness—resting and recovering.",
        teammates_on_leave: ["Chirag"],
        status: "Rejected",
        approver_avatar:
          "https://sixtify.s3.amazonaws.com/1723805168303_depositphotos_675471232-stock-illustration-lion-king-wild-roars-majestic_1715750732604 - Copy.jpg",
        action_by: "Chirag Sodnagar",
        action_at: "2024-11-28T11:37:13.682Z",
        remark: "Workload",
      },
    },
    { status: 200 }
  );
}
