import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave Balance History retrieved successfully.",
      data: {
        totalCount: 6,
        data: [
          {
            id: "466c3100-44df-4bf9-acf9-97f963a4c58b",
            created_at: "2025-01-14T18:30:00.000Z",
            log_type: "accrual",
            balance_change: -2,
            balance: 2,
          },
          {
            id: "46d4af11-4720-4c55-9f35-b5e91bd71b4b",
            created_at: "2025-01-14T18:30:00.000Z",
            log_type: "accrual",
            balance_change: +2,
            balance: 4,
          },
          {
            id: "46d4af11-4720-4c55-9f35-b5e91bd71b4b",
            created_at: "2025-01-14T18:30:00.000Z",
            log_type: "accrual",
            balance_change: +2,
            balance: 6,
          },
          {
            id: "46d4af11-4720-4c55-9f35-b5e91bd71b4b",
            created_at: "2025-01-14T18:30:00.000Z",
            log_type: "accrual",
            balance_change: -2,
            balance: 4,
          },
          {
            id: "46d4af11-4720-4c55-9f35-b5e91bd71b4b",
            created_at: "2025-01-14T18:30:00.000Z",
            log_type: "accrual",
            balance_change: -1,
            balance: 3,
          },
          {
            id: "46d4af11-4720-4c55-9f35-b5e91bd71b4b",
            created_at: "2025-01-14T18:30:00.000Z",
            log_type: "accrual",
            balance_change: +1,
            balance: 4,
          },
        ],
      },
    },
    { status: 200 }
  );
}
