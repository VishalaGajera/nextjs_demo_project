import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Overtime rules config listed successfully",
      data: {
        totalCount: 1,
        overTimeRules: [
          {
            id: "62990593-afe1-444b-9c7e-6fd3ec991235",
            company_name: "Codezee Solutions PVT Ltd.",
            overtime_rule_code: "BWHC",
            overtime_rule_name: "based on work hours config",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
