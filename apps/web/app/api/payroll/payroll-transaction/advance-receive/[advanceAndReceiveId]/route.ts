import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Advance receive retrieved successfully.",
      data: {
        id: "6bab8883-7c72-4178-8a0c-71d44059394b",
        company_id: "160c179d-b6fe-42c3-8e85-cc77915b3624",
        employee_id: "86546d5e-c4a5-4d01-b875-ca11dd46eadc",
        component_type: "advance",
        transaction_date: "2025-03-20T18:30:00.000Z",
        deduction_month: "2025-08",
        transaction_type: "cheque",
        amount: 150000,
        remark: "Performance bonus for Q1",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Advance receive updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Advance receive deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
