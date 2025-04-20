import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Earning component retrieved successfully.",
      data: {
        id: "855b214f-3a3c-49f4-a2e2-62ec016f3552",
        earning_component_type: "fixed",
        calculation_type: "recurring",
        earning_component_code: "CODEZEE",
        earning_component_name: "TESTING",
        description: "Changes",
        is_taxable: false,
        tax_exemption_limit: 1505.89,
        is_proof_required: false,
        consider_for_pf: true,
        consider_for_pt: true,
        consider_for_esi: true,
        max_limit_per_year: 989.99,
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Earning component updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Earning component deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
