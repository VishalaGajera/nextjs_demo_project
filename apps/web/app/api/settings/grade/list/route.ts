import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Grades listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 2,
        grades: [
          {
            id: "e8036f4a-fa62-48a8-94c1-f6c01bd33a1b",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            grade_code: "AD1",
            grade_name: "Senior Manager Officer1",
            description: "Junior Associate.",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-16T10:06:01.866Z",
            full_count: "2",
          },
          {
            id: "e8036f4a-fa62-48a8-94c1-f6c01bd33a1b",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            grade_code: "AD",
            grade_name: "Senior Manager Officer",
            description: "Senior Manager Officer",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-12T12:31:23.631Z",
            full_count: "2",
          },
        ],
      },
    },
    { status: 200 }
  );
}
