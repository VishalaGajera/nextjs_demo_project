import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Data Import History listed successfully.",
      data: {
        totalCount: 1,
        dataImports: [
          {
            id: "2559c622-d2a1-4d31-89d1-7139e59a4b42",
            import_log: "Total 1 records added",
            template_name: "Add Employee",
            master_name: "Add Employees",
            company_name: "RAMKRISHNA DIAMOND PVT LTD",
            action_by: "Demo Demo",
            action_at: "2025-02-15T10:14:12.050Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
