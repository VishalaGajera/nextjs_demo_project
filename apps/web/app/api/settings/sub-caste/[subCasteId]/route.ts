import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Sub caste retrieved successfully.",
    data: {
      id: "8ebb9638-72a1-4ecf-9bdb-24470d5b1021",
      caste_name: "brahmin",
      company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
      sub_caste_name: "Patel",
      is_active: true,
      company_name: "Codezee Solutions PVT Ltd.",
      action_by: "Demo Demo",
      action_at: "2024-09-03T11:28:32.392Z",
    },
  });
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "sub-caste updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "sub-caste deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
