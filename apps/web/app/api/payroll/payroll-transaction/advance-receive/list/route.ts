import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Advance receives retrieved successfully.",
      data: {
        totalCount: 1,
        advanceAndReceive: [
          {
            id: "a1871216-5c7e-48b8-acd6-4d3e0c9c4140",
            employee_name: "CHIRAG KOLADIYA",
            employee_code: "40",
            avatar:
              "https://sixtify.s3.amazonaws.com/1741674534796_download (5).jpeg",
            punch_code: "40",
            department_name: "IT",
            sub_department_name: "Node",
            designation_name: "ADMIN",
            reporting_manager_name: "Keval Donga",
            reporting_manager_avatar:
              "https://sixtify.s3.amazonaws.com/1741674534796_download (5).jpeg",
            component_type: "advance",
            transaction_date: "2025-03-20T18:30:00.000Z",
            deduction_month: "2025-03",
            transaction_type: "bank",
            amount: 10000,
            remark: "Performance bonus for Q1",
            action_by: "Demo Demo",
            action_at: "2025-04-02T05:32:48.687Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 201 }
  );
}
