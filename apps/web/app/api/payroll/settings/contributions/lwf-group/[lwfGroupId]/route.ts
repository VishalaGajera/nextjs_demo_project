import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "LWF group retrieved successfully.",
      data: {
        id: "840e4b19-a90e-4ee3-b5f6-20d5c9b28664",
        state_id: "4ddf9a22-d50d-44d2-914c-445cde159dd8",
        state_name: "Maharashtra",
        deduction_cycle_type: "half_yearly",
        contribution_start_month: 12,
        deduction_months: [12, 5, 3, 2],
        contribution_slabs: [
          {
            id: "53ca46a9-bfdd-4f05-a051-474b45d6daf1",
            start_amount: 1000,
            end_amount: 1500,
            employee_contribution_rate: 1.5,
            employer_contribution_rate: 1.5,
          },
        ],
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "LWF group deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
