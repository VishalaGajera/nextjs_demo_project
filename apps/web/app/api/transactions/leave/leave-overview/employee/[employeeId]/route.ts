import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee leave overview details retrieved successfully.",
      data: {
        id: "e10e40cb-5668-4466-8ecf-aaf62d6e811a",
        employee_name: "New Emp 3.0",
        avatar: null,
        joining_date: "2025-01-17T18:30:00.000Z",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        leave_plan_id: "d1a537f3-326b-4bdb-acde-a7fefff44c66",
        leave_plan_year_start_month: 4,
        designation_name: "HR Manager",
      },
    },
    { status: 200 }
  );
}
