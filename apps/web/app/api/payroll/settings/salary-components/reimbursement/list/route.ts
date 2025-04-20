import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Reimbursement component listed successfully.",
      data: {
        totalCount: 2,
        reimbursementComponents: [
          {
            id: "28d313cd-8a73-4c80-bd8f-c64dbb50b6f2",
            calculation_type: "recurring",
            reimbursement_component_code: "CODEZEES",
            reimbursement_component_name: "Testi Extra",
            is_claim_required: true,
            full_count: "2",
          },
          {
            id: "cbe50931-fd9b-4bde-a80f-eb36f9e236fc",
            calculation_type: "recurring",
            reimbursement_component_code: "CODEZEE",
            reimbursement_component_name: "Testi Extra Work",
            is_claim_required: true,
            full_count: "2",
          },
        ],
      },
    },
    { status: 200 }
  );
}
