import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "company basic details fetched successfully.",
    data: {
      id: "bb511140-e2ca-41a7-9490-8c0f4f4db09d",
      company_name: " Tata Consultancy Services",
      email: "contact@tcs.com",
      phone_no: null,
      mobile_no: "9123456789",
      industry_id: "37caed44-d6a4-4313-984f-a9069fba697a",
      industry_name: "Information Technology & Services",
      company_start_date: "2021-04-12T00:00:00.000Z",
      about_company:
        "Nirmal Building, Nariman Point Tata Consultancy Services Tata Consultancy Services Tata Consultancy Services",
      vision_and_mission:
        "Nirmal Building, Nariman Point Tata Consultancy Services Tata Consultancy Services Tata Consultancy Services",
      company_logo: null,
      address: "Nirmal Building, Nariman Point ",
      city_id: "2c25d9a9-ca45-4fc8-b8eb-ae3af2711691",
      city_name: "Surat",
      state_id: "f4eaa281-bba0-4113-9d78-68dbf7f01c37",
      state_name: "Gujarat",
      country_id: "a5317edb-609a-42ff-8ace-d40e8fd62fbc",
      country_name: "India",
      pin_code: "400021",
    },
  });
}

export async function PATCH() {
  return NextResponse.json({
    message: "company basic details updated successfully.",
    data: null,
  });
}
