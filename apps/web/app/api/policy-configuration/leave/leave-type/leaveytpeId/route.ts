import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave type retrieved successfully.",
      data: {
        id: "a2c75a62-49b5-469d-be67-bbaa7332791d",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        leave_type: "unpaid",
        leave_type_code: "DIWALI",
        leave_type_name: "Diwali Vacation",
        description: "Diwali Vacation paid leave for all employees.",
        is_sick_leave: true,
        applicable_to_gender: "other",
        colour_code: "#01fafe",
        applicable_to_marital_status: "married",
        leave_reasons: ["Diwali Vacation", "all"],
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Leave type updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
