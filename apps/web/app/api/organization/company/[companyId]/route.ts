import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Company fetched successfully.",
      data: {
        id: "bb511140-e2ca-41a7-9490-8c0f4f4db09d",
        company_name: "Tata Consultancy Services",
        email: "contact@tcs.com",
        phone_no: null,
        mobile_no: "9123456789",
        director_name: "Rajesh Gopinathan",
        industry_id: "37caed44-d6a4-4313-984f-a9069fba697a",
        industry_name: "Information Technology & Services",
        company_start_date: "2021-04-12T00:00:00.000Z",
        company_logo: null,
        authorized_signature: null,
        about_company: null,
        vision_and_mission: null,
        address: "Nirmal Building, Nariman Point",
        city_id: "2c25d9a9-ca45-4fc8-b8eb-ae3af2711691",
        city_name: "Surat",
        state_id: "f4eaa281-bba0-4113-9d78-68dbf7f01c37",
        state_name: "Gujarat",
        country_id: "a5317edb-609a-42ff-8ace-d40e8fd62fbc",
        country_name: "India",
        pin_code: "400021",
        cin_no: null,
        registered_date: null,
        pan_no: "AAAAA1111A",
        tan_no: null,
        pf_no: null,
        esi_no: null,
        gst_no: null,
        pt_no: null,
        license_no: "WIPRO12345",
        lwf_est_code: "WIPRO-BLR-789",
        action_by: "Jenish Chanchad",
        action_at: "2024-08-27T10:29:57.601Z",
      },
    },
    { status: 201 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Company updated successfully.",
      data: {
        id: "bb511140-e2ca-41a7-9490-8c0f4f4db09d",
        company_name: "Tata Consultancy Services",
        email: "contact@tcs.com",
        phone_no: null,
        mobile_no: "9123456789",
        director_name: "Rajesh Gopinathan",
        industry_id: "37caed44-d6a4-4313-984f-a9069fba697a",
        company_start_date: "2021-04-12T00:00:00.000Z",
        company_logo: null,
        authorized_signature: null,
        about_company: null,
        vision_and_mission: null,
        address: "Nirmal Building, Nariman Point",
        pin_code: "400021",
        city_id: "2c25d9a9-ca45-4fc8-b8eb-ae3af2711691",
        state_id: "f4eaa281-bba0-4113-9d78-68dbf7f01c37",
        country_id: "a5317edb-609a-42ff-8ace-d40e8fd62fbc",
        registered_date: null,
        cin_no: null,
        pan_no: "AAAAA1111A",
        tan_no: null,
        pf_no: null,
        esi_no: null,
        gst_no: null,
        pt_no: null,
        is_deleted: false,
        created_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        updated_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        deleted_by: "f8d860f0-c093-4d88-808c-75a23779a105",
        created_at: "2024-08-27T10:10:18.232Z",
        updated_at: "2024-08-27T10:30:33.823Z",
        deleted_at: "2024-08-27T10:14:35.517Z",
        license_no: "WIPRO12345",
        lwf_est_code: "WIPRO-BLR-789",
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Company deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
