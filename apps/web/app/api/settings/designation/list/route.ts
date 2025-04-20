import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Designation listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
        designations: [
          {
            id: "5830c768-0c6b-4334-aec3-b58a88a39649",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            designation_code: "PRM",
            designation_name: "Project Reposter",
            description: "This is example of Project Reposter",
            is_active: true,
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-16T10:02:33.563Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
