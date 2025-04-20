import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Insurance details listed successfully.",
      data: {
        totalCount: 1,
        insuranceDetails: [
          {
            id: "31770f50-d419-4801-8077-fe1c5fad76d6",
            employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
            insurance_type: "health",
            insured_name: "John Doe",
            insurance_provider: "HDFC ERGO health insurance",
            policy_no: "POL123456789",
            insured_amount: 500000,
            relation: "child",
            issue_date: "2023-01-15T00:00:00.000Z",
            expiry_date: "2024-01-15T00:00:00.000Z",
            action_by: "Demo",
            action_at: "2024-08-20T04:25:33.329Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
