import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Industry added successfully.",
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
    { status: 201 }
  );
}
