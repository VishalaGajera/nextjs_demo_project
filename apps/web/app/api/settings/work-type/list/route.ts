import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Work types listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 3,
        workTypes: [
          {
            id: "a6948f39-804b-4ce1-a6a9-119f6ba2b7d0",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            work_type_code: "PA1",
            work_type_name: "Part-Time1",
            description: "Part-Time1",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-16T10:09:24.067Z",
            full_count: "3",
          },
          {
            id: "73357eff-9d64-4991-84db-cd1b0b089f00",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            work_type_code: "FT",
            work_type_name: "Full Time",
            description: "This is a Full Time work type.",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-12T12:45:31.013Z",
            full_count: "3",
          },
          {
            id: "9831c0ba-4b8e-460e-b55e-1eb794965e7b",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            work_type_code: "PA",
            work_type_name: "Part-Time",
            description: "Part-Time",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-12T12:44:54.966Z",
            full_count: "3",
          },
        ],
      },
    },
    { status: 200 }
  );
}
