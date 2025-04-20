import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Reimbursement component retrieved successfully.",
      data: {
        id: "cbe50931-fd9b-4bde-a80f-eb36f9e236fc",
        calculation_type: "recurring",
        reimbursement_component_code: "CODEZEE",
        reimbursement_component_name: "Testi Extra Work",
        description: "salary earning",
        is_claim_required: true,
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Reimbursement component updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Reimbursement component deleted successfully.", data: null },
    { status: 200 }
  );
}
