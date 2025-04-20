import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Business Unit fetched successfully.",
      data: {
        id: "60617d90-6bcd-4734-9ad1-b6e53f0cdd84",
        company_id: "2ce7aac1-1bf4-4518-a3b7-53308afa1521",
        business_unit_name: "Code Info",
        unit_license_no: "test",
        email: null,
        phone_no: null,
        mobile_no: null,
        address: null,
        city_id: null,
        state_id: null,
        country_id: null,
        pin_code: null,
        company_name: "CMCREATION PVT LTD",
        city_name: null,
        state_name: null,
        country_name: null,
        action_by: "Jenish Chanchad",
        action_at: "2024-06-25T12:22:11.542Z",
        full_count: "16",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Business Unit updated successfully.",
      data: {
        id: "25b5d8d0-eea7-44e8-a744-55f124bf0d3e",
        company_id: "2ce7aac1-1bf4-4518-a3b7-53308afa1521",
        business_unit_name: "Global Enterprises 123",
        email: null,
        phone_no: null,
        mobile_no: null,
        address: null,
        city_id: null,
        state_id: null,
        country_id: null,
        pincode: null,
        company_name: "CMCREATION PVT LTD",
        city_name: null,
        state_name: null,
        country_name: null,
        action_by: "Jenish Chanchad",
        action_at: "2024-06-25T11:31:00.513Z",
        full_count: "16",
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Business unit deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
