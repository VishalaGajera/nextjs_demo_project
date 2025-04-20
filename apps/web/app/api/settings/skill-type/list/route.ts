import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Skill types listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
        skillTypes: [
          {
            id: "bc07baea-f5e6-41cb-be02-100b4cd1bafe",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            skill_type_code: "HSKL12",
            skill_type_name: "Highly Skilled12",
            description: "Highly skilled worker1",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-16T10:11:51.207Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
