import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee reference retrieved successfully.",
      data: {
        id: "0c7d2d7f-19e1-4641-8946-333e57f1541a",
        reference_type: "colleague",
        reference_employee_id: "f8d860f0-c093-4d88-808c-75a23779a105",
        reference_name: "Bhavik Shah",
        reference_mobile_no: "+91 9998555772",
        reference_address: "katargam",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee reference updated successfully.",
      data: "Validation Error",
    },
    { status: 200 }
  );
}
