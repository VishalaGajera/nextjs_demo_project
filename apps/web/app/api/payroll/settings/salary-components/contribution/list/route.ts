import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Contribution component listed successfully.",
      data: {
        totalCount: 2,
        contributionComponents: [
          {
            id: "0589af40-a2a6-4127-801d-24f3451bfec1",
            calculation_type: "recurring",
            contribution_component_code: "CODEZE",
            contribution_component_name: "Testi",
            is_taxable: true,
            is_system_generated: false,
            full_count: "2",
          },
          {
            id: "30129ab6-34df-452f-ae45-1f37a048421b",
            calculation_type: "recurring",
            contribution_component_code: "CODEE",
            contribution_component_name: "Testi  Work Payout",
            is_taxable: true,
            is_system_generated: true,
            full_count: "2",
          },
        ],
      },
    },
    { status: 200 }
  );
}
