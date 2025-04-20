import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Contribution component retrieved successfully.",
      data: {
        id: "30129ab6-34df-452f-ae45-1f37a048421b",
        calculation_type: "recurring",
        contribution_component_code: "CODEE",
        contribution_component_name: "Testi  Work Payout",
        description: "salary earning",
        is_taxable: true,
        tax_exemption_limit: 2,
        is_proof_required: true,
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Contribution component updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Contribution component deleted successfully.", data: null },
    { status: 200 }
  );
}
