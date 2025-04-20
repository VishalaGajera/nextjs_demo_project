import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Overtime rate type listed successfully.",
      data: {
        totalCount: 4,
        overtimeRateType: [
          {
            id: "c9f6c547-a7e0-48ba-88cf-866810d8fcc2",
            company_name: "RAMKRISHNA DIAMOND PVT.LTD",
            overtime_rate_code: "OT005",
            overtime_rate_name: "Standard Overtime1s",
            overtime_type: "fixed_ot",
            action_by: "Demo Demo",
            action_at: "2024-09-03T10:58:19.073Z",
            full_count: "4",
          },
          {
            id: "4d9243bc-8bd1-4e69-af75-3a4418a399ba",
            company_name: "RAMKRISHNA DIAMOND PVT.LTD",
            overtime_rate_code: "OT0023",
            overtime_rate_name: "Standard Overtimease",
            overtime_type: "fixed_ot",
            action_by: "Demo Demo",
            action_at: "2024-09-03T10:58:19.073Z",
            full_count: "4",
          },
          {
            id: "c789c86d-f8f9-49e9-a1c5-677ecf646163",
            company_name: "RAMKRISHNA DIAMOND PVT.LTD",
            overtime_rate_code: "OT002a",
            overtime_rate_name: "Standard Overtimeas",
            overtime_type: "fixed_ot",
            action_by: "Demo Demo",
            action_at: "2024-09-03T10:58:19.073Z",
            full_count: "4",
          },
          {
            id: "8920055e-2fa6-4e5e-a833-6ec76f8aceca",
            company_name: "RAMKRISHNA DIAMOND PVT.LTD",
            overtime_rate_code: "OT002",
            overtime_rate_name: "Standard Overtimes",
            overtime_type: "fixed_ot",
            action_by: "Demo Demo",
            action_at: "2024-09-03T10:58:19.073Z",
            full_count: "4",
          },
        ],
      },
    },
    { status: 200 }
  );
}
