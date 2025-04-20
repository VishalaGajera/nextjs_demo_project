import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave Balances retrieved successfully.",
      data: {
        id: "30b71c81-8532-46a1-9780-e0dbf3008ddc",
        employee_name: "Jay kyada",
        avatar:
          "https://sixtify.s3.amazonaws.com/1732883450754_profile-icon-white-background_941097-162371.avif",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        leave_plan_id: "17ac9d65-4aa7-47e8-9d09-97f4aecdfa91",
        designation_name: "HR Manager",
        leave_details: [
          {
            id: "eb42cc02-1547-4c8d-b6eb-be16437148b1",
            leave_type_name: "Privillage Leave",
            leave_type: "paid",
            quota_type: null,
            leave_type_colour_code: "#009688",
            annual_leaves: null,
            accrual_leave: 6,
            used_leaves: 0,
            available_balance: 6,
          },
          {
            id: "810d7405-37c9-45d3-b710-5e7d958c0e83",
            leave_type_name: "Netflix BingeWatch",
            leave_type: "unpaid",
            quota_type: null,
            leave_type_colour_code: "#009688",
            annual_leaves: null,
            accrual_leave: 4,
            used_leaves: 3,
            available_balance: 1,
          },
          {
            id: "850f7716-c55b-45f0-b8cf-4d9ef8f8ede8",
            leave_type_name: "Wellness Leave",
            leave_type: "paid",
            quota_type: null,
            leave_type_colour_code: "#009688",
            annual_leaves: null,
            accrual_leave: null,
            used_leaves: null,
            available_balance: null,
          },
        ],
      },
    },
    { status: 200 }
  );
}
