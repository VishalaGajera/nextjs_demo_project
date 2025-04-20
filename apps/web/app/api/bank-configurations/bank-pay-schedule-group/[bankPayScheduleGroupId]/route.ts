import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Bank pay schedule group retrieved successfully.",
      data: {
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        description: "pay",
        month_year: "2025-08",
        weekly_off: "monday",
        is_weekly_off_paid: false,
        month_days: 31,
        payable_days: 27,
        total_weekly_off: 4,
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Bank pay schedule group updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Bank pay schedule group deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
