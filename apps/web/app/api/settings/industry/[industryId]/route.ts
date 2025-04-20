import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Industry fetched successfully.",
      data: {
        id: "d871f356-233e-42b6-ac79-d46f0b55b397",
        industry_name: "Construction & Real Estate",
        is_deleted: false,
        created_by: null,
        updated_by: "fcf3ac5a-b6cd-413c-a714-a3e3157ea33b",
        deleted_by: null,
        created_at: "2024-05-09T11:34:41.062Z",
        updated_at: "2024-05-31T09:28:31.797Z",
        deleted_at: null,
        description:
          "Companies involved in construction and real estate development.",
        is_active: true,
        action_by: "Chirag S",
        action_at: "2024-05-31T09:28:31.797Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Industry updated successfully.",
      data: {
        id: "923c5eef-1e53-4171-bbb7-6d67acc6e943",
        industry_name: "Brooke Riley",
        is_deleted: false,
        created_by: "5635538d-adf8-4853-81a6-175ee82977e1",
        updated_by: "9abf4988-6035-418c-96e0-899fb9ac5876",
        deleted_by: null,
        created_at: "2024-06-11T10:31:13.665Z",
        updated_at: "2024-06-12T09:18:30.267Z",
        deleted_at: null,
        description: "Pariatur Alias do n",
        is_active: false,
        action_by: "Bhavik",
        action_at: "2024-06-12T09:18:30.267Z",
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Industry deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
