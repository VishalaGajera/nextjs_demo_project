import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Deduction components retrieved successfully.",
      data: {
        id: "1b8ac676-31ba-46b4-aa9a-3a3d106ae68d",
        deduction_component_type: "deduction",
        calculation_type: "recurring",
        deduction_component_code: "BONUS",
        deduction_component_name: "Annual Bonus",
        description: "tax_exemption_limit",
        is_taxable: false,
        tax_exemption_limit: 120.01,
        is_proof_required: true,
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Deduction component updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Deduction component deleted successfully.", data: null },
    { status: 200 }
  );
}
