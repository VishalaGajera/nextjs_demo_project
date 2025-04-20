import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Earning component listed successfully.",
      data: {
        totalCount: 1,
        earningComponents: [
          {
            id: "855b214f-3a3c-49f4-a2e2-62ec016f3552",
            calculation_type: "recurring",
            earning_component_type: "fixed",
            earning_component_code: "CODEZEE",
            earning_component_name: "TESTING",
            is_taxable: false,
            consider_for_pf: true,
            consider_for_pt: true,
            consider_for_esi: true,
            max_limit_per_year: 989.99,
            is_system_generated: false,
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
