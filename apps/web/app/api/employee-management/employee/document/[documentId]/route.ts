import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee document retrieved successfully.",
      data: {
        id: "42e9c9cf-24c6-4513-956b-7399cca0816a",
        employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
        document_type: "aadhaar_card",
        document_details: {
          name: "Pritesh Patel",
          address: "parvat patiya surat",
          updated_by: "f8d860f0-c093-4d88-808c-75a23779a105",
          document_no: "707908500648",
          document_url: ["http://example.com/path/to/back_page.pdf"],
          date_of_birth: "1998-10-01",
        },
        action_by: "Jenish Chanchad",
        action_at: "2024-08-23T11:55:23.584Z",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee document updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Employee education detail deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
