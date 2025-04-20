import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Loan policy retrieved successfully.",
      data: {
        id: "bdb7bc6c-ea18-4dbd-aec1-57a95eaffe59",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        loan_policy_code: "ALC0089",
        loan_policy_name: "Personal6",
        description: "Short-term personal loan category",
        is_approval_required: true,
        approval_levels: [
          {
            is_auto_approve_days_enabled: true,
            auto_approve_days: 1,
            level_approvers: [
              {
                approver_type: "by_employee",
                employee_id: "9ebeddc7-ed56-43b0-8767-4f3a0c784e51",
              },
            ],
          },
          {
            is_auto_approve_days_enabled: false,
            level_approvers: [
              {
                approver_type: "by_employee",
                employee_id: "df8adef6-c40b-4317-838b-c6b0321df268",
              },
            ],
          },
        ],
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Loan policy updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}
