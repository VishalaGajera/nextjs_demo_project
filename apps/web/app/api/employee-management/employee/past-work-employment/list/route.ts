import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Past work employment listed successfully.",
      data: {
        totalCount: 1,
        pastWorkEmployments: [
          {
            id: "2f1b4069-7e38-45a4-ad73-c2f70fcf2913",
            employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
            company_name: "Tech Innovators Inc.     ",
            designation: "Senior Software Engineer",
            from_date: "2018-05-01T00:00:00.000Z",
            to_date: "2022-04-30T00:00:00.000Z",
            address: "123 Innovation Drive, Tech City, CA 94016",
            leaving_reason: "Better Career Opportunity",
            action_by: "Demo",
            action_at: "2024-08-16T12:01:57.038Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
