import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    statusCode: 200,
    message: "List weeklyOffs successfully",
    data: {
      totalPages: 1,
      currentPage: 1,
      totalCount: 1,
      weeklyOffTypes: [
        {
          id: "df24378f-14c5-44cb-af2c-707e2c4c2696",
          company_name: "Frenkg",
          weekly_off_type_name: "testbhavik",
          description: "test",
          weekly_off_day: "monday",
          action_by: "Chirag Sondagar",
          action_at: "2024-08-29T12:58:55.018Z",
          deleted_at: null,
          full_count: "1",
        },
      ],
    },
  });
}
