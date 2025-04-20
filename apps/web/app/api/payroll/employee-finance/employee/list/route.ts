import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Employee finance details retrieved successfully.",
    data: {
      totalCount: 2,
      employeeFinances: [
        {
          id: "1daac914-5bb5-4e32-b7db-6a3a1b288f16",
          employee_code: "HI109NAL",
          punch_code: "1114",
          avatar: "https://sixtify.s3.amazonaws.com/1724304517532_preview.jpg",
          employee_name: "Kenil KB Patel",
          department_name: "Testing Fields",
          sub_department_name: "Testingggggggggg HHHH",
          designation_name: "QA Executive",
          reporting_manager_name: "Jaimin Patel",
          salary: "384,000.00",
          full_count: "2",
        },
        {
          id: "04ea770e-968d-4fb8-ad1f-889d83d6924c",
          employee_code: "HI108NAL",
          punch_code: "1114",
          avatar: "https://sixtify.s3.amazonaws.com/1724304517532_preview.jpg",
          employee_name: "Kenil KB Patel",
          department_name: "Testing Fields",
          sub_department_name: "Testingggggggggg HHHH",
          designation_name: "QA Executive",
          reporting_manager_name: "Jaimin Patel",
          salary: null,
          full_count: "2",
        },
      ],
    },
  });
}
