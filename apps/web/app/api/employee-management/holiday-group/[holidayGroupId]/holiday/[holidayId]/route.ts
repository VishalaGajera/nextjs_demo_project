import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holiday retrieved successfully.",
      data: {
        id: "b3213d7b-123a-487d-bd1c-7df841c51234",
        holiday_name: "Independence Day",
        holiday_date: "2024-08-15T00:00:00.000Z",
      },
    },
    { status: 200 }
  );
}
export async function PATCH() {
  return NextResponse.json(
    {
      message: "Holiday Updated successfully.",
      data: {
        id: "b3213d7b-123a-487d-bd1c-7df841c51234",
        holiday_name: "Independence Day",
        holiday_date: "2024-08-15T00:00:00.000Z",
      },
    },
    { status: 200 }
  );
}
export async function DELETE() {
  return NextResponse.json(
    {
      message: "Holiday Deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
