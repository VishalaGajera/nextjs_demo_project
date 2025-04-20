import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Sub-department added successfully.",
      data: {
        id: "a4903c4f-35a1-477c-ab1c-6cf841c611ea",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        department_id: "0cf33ba7-61dc-4b3c-b2d0-80a1b3090092",
        sub_department_name: "Software Manager",
        sub_department_code: "SM",
        description: "This is the Software Manager.",
        is_active: false,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T09:57:13.436Z",
        updated_at: "2024-07-16T09:57:13.436Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}
