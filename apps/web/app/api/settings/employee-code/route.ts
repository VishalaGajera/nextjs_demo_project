import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Employee code added successfully.",
      data: {
        id: "715e5a64-7d0d-4434-a2e9-d29998555773",
        name: "Management",
        series_start: 8000,
        is_active: true,
        prefix: "MNG",
        suffix: "M",
        numeric_series: 1,
        example: "MNG0001X",
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
    { status: 201 }
  );
}
