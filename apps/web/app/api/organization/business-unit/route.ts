import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Business Unit added successfully.",
      data: {
        id: "8129808b-74de-44c4-91b7-657de95e3533",
        company_id: "816a2506-91c6-4b23-841d-cd174e42a074",
        business_unit_name: "Code Info",
        email: "jaydipgolakiya100@gmail.com",
        phone_no: "09227111212",
        mobile_no: "9227111212",
        address: "varachha",
        city_id: "5d01550d-0f0f-4b11-a911-e3a4e1aeabb9",
        state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        pin_code: "395004",
        company_name: "CMCREATION PVT LTD",
        city_name: "Surat",
        state_name: "Gujarat",
        country_name: "India",
        action_by: "Jenish Chanchad",
        action_at: "2024-06-26T06:25:30.989Z",
        full_count: "16",
      },
    },
    { status: 200 }
  );
}
