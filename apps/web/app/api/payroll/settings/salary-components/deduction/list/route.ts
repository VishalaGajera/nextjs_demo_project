import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Deduction component listed successfully.",
      data: {
        totalCount: 1,
        deductionComponents: [
          {
            id: "1b8ac676-31ba-46b4-aa9a-3a3d106ae68d",
            calculation_type: "recurring",
            deduction_component_type: "deduction",
            deduction_component_code: "BONUS",
            deduction_component_name: "Annual Bonus",
            is_taxable: false,
            is_system_generated: true,
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
