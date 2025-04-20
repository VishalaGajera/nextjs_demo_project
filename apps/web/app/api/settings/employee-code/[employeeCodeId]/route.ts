import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee code successfully.",
      data: {
        id: "715e5a64-7d0d-4434-a2e9-d29998555771",
        name: "Contractor",
        series_start: 1000,
        is_active: true,
        prefix: "CT",
        suffix: "X",
        numeric_series: 1,
        example: "CT0001X",
        is_deleted: false,
        created_by: "9abf4988-6035-418c-96e0-899fb9ac5876",
        updated_by: "9abf4988-6035-418c-96e0-899fb9ac5876",
        deleted_by: null,
        created_at: "2024-06-21T06:22:40.917Z",
        updated_at: "2024-06-21T06:22:40.917Z",
        deleted_at: null,
        action_by: "Manish",
        action_at: "2024-06-21T06:22:40.917Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee code successfully.",
      data: {
        id: "715e5a64-7d0d-4434-a2e9-d29998555774",
        name: "Senior Staff",
        series_start: 7000,
        is_active: true,
        prefix: "SR",
        suffix: "S",
        numeric_series: 1,
        example: "SF100S",
        is_deleted: false,
        created_by: "9abf4988-6035-418c-96e0-899fb9ac5876",
        updated_by: "9abf4988-6035-418c-96e0-899fb9ac5876",
        deleted_by: null,
        created_at: "2024-06-21T06:22:40.917Z",
        updated_at: "2024-06-21T06:22:40.917Z",
        deleted_at: null,
        action_by: "Manish",
        action_at: "2024-06-21T06:22:40.917Z",
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Employee code deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
