import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "EMPLOYEE_ADDRESS_RETRIEVED_SUCCESSFULLY",
      data: {
        id: "8c372dda-5620-4dc7-b405-fccc2b2f706b",
        employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
        address_type: "present",
        name: "John Doe",
        address: "123 Main St, New York, NY",
        city_id: "2c25d9a9-ca45-4fc8-b8eb-ae3af2711691",
        city_name: "Surat",
        state_id: "f4eaa281-bba0-4113-9d78-68dbf7f01c37",
        state_name: "Gujarat",
        country_id: "a5317edb-609a-42ff-8ace-d40e8fd62fbc",
        country_name: "India",
        pin_code: "395006",
        mobile_no: "1234567890",
        email: "johndoe@example.com",
        action_by: "Demo",
        action_at: "2024-08-12T05:02:31.470Z",
      },
    },
    { status: 200 }
  );
}
