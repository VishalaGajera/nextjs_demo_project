import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Business location added successfully.",
      data: {
        id: "db100da8-ecbb-4f30-ab2c-124040b3cff1",
        business_unit_id: "f15bec4d-86ab-4601-a4e9-b91c184466b4",
        location_name: "Samsung Enterprises",
        email: "demo@gmail.com",
        phone_no: null,
        mobile_no: null,
        address: null,
        pin_code: null,
        city_id: null,
        state_id: null,
        country_id: null,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T09:29:32.941Z",
        updated_at: "2024-07-16T09:29:32.941Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}
