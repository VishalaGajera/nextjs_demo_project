import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Excel Template configuration options retrieved successfully.",
      data: [
        {
          value: "3e52bd13-d43f-464c-9ab9-3dc5d88f74e5",
          label: "Add Employee",
          master_name: "Add Employees",
          master_code: "add_employees",
          company_id: "0e213571-3f21-4e72-9b3f-bddb2fad6259",
          company_name: "RAMKRISHNA DIAMOND PVT LTD",
        },
      ],
    },
    { status: 200 }
  );
}
