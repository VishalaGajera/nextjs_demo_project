import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Business location retrieved successfully.",
      data: {
        id: "db100da8-ecbb-4f30-ab2c-124040b3cff1",
        business_unit_id: "25b5d8d0-eea7-44e8-a744-55f124bf0d3e",
        business_unit_name: "demo",
        location_name: "Samsung Enterprises",
        email: "demo@gmail.com",
        phone_no: null,
        mobile_no: null,
        address: "1234 Samsung St, Suite 100",
        city_id: null,
        city_name: null,
        state_id: null,
        state_name: null,
        country_id: null,
        country_name: null,
        pin_code: null,
        action_by: "Demo",
        action_at: "2024-07-16T09:31:44.881Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Business location updated successfully.",
      data: {
        id: "db100da8-ecbb-4f30-ab2c-124040b3cff1",
        business_unit_id: "25b5d8d0-eea7-44e8-a744-55f124bf0d3e",
        location_name: "Samsung Enterprises",
        email: "demo@gmail.com",
        phone_no: null,
        mobile_no: null,
        address: "1234 Samsung St, Suite 100",
        pin_code: null,
        city_id: null,
        state_id: null,
        country_id: null,
        is_deleted: false,
        created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
        deleted_by: null,
        created_at: "2024-07-16T09:29:32.941Z",
        updated_at: "2024-07-16T09:31:44.881Z",
        deleted_at: null,
      },
    },
    { status: 201 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Business location deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
