import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave request retrieved successfully.",
      data: {
        id: "012a0398-5253-40b6-aa86-844103a0c477",
        employee_id: "8213c059-308e-4705-9999-ff0a685d3f9a",
        leave_plan_id: "17ac9d65-4aa7-47e8-9d09-97f4aecdfa91",
        leave_plan_name: "Binge Watch",
        leave_type_id: "34f525ef-b23c-4021-ad62-05190acf1d2c",
        leave_type_name: "Netflix BingeWatch",
        leave_type: "unpaid",
        from_date: "2024-12-04T18:30:00.000Z",
        to_date: "2024-12-05T18:30:00.000Z",
        from_half: "first_half",
        to_half: "second_half",
        leave_reason: "meri marzi",
        leave_status: "rejected",
        action_remark: null,
        attachments: ["https://www.google.com"],
        notifies: [],
        teammates_on_leave: ["chirag", "vaibhav"],
        action_details: {
          id: "f63571db-bbce-4b7e-a4e1-ef804caae7b4",
          employee_name: "Chirag",
          action_reason: "workload",
          avatar:
            "https://sixtify.s3.amazonaws.com/1723805168303_depositphotos_675471232-stock-illustration-lion-king-wild-roars-majestic_1715750732604 - Copy.jpg",
          action_at: "2024-11-27T11:37:13.682Z",
        },
        applied_by_details: {
          id: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
          employee_name: "Demo Demo",
          avatar:
            "https://sixtify.s3.amazonaws.com/1723805168303_depositphotos_675471232-stock-illustration-lion-king-wild-roars-majestic_1715750732604 - Copy.jpg",
          applied_at: "2024-11-27T11:37:13.682Z",
        },
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Leave request updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
