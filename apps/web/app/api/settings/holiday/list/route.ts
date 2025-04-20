import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Holidays listed successfully.",
      data: {
        totalCount: 2,
        holidays: [
          {
            id: "84561567-88b3-410d-a464-d9d7311ab0ef",
            holiday_name: "New Year",
            holiday_date: "2024-01-25T18:30:00.000Z",
            year: "2024",
            description: "This is the Mohram.",
            is_recommended: false,
            is_active: true,
            action_by: "Demo Demo",
            action_at: "2024-09-25T09:22:13.654Z",
            full_count: "2",
          },
          {
            id: "fd2a8f9e-9d34-4bb0-97a8-75a2aace1e30",
            holiday_name: "Mohram",
            holiday_date: "2024-01-21T18:30:00.000Z",
            year: "2024",
            description: "This is the Mohram.",
            is_recommended: false,
            is_active: true,
            action_by: "Demo Demo",
            action_at: "2024-09-25T09:21:51.081Z",
            full_count: "2",
          },
        ],
      },
    },
    { status: 200 }
  );
}
