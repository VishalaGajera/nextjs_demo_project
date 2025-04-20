import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Loan policies retrieved successfully.",
      data: {
        totalCount: 2,
        loanPolicies: [
          {
            id: "bdb7bc6c-ea18-4dbd-aec1-57a95eaffe59",
            company_name: "RAMKRISHNA DIAMOND PVT LTD",
            loan_policy_code: "ALC008",
            loan_policy_name: "Personal689",
            description: "Short-term personal loan category",
            is_approval_required: true,
            action_by: "Demo Demo",
            action_at: "2025-03-13T06:54:09.799Z",
            full_count: "2",
          },
          {
            id: "65ea508d-d07b-49c5-9c69-edcf8c6abe39",
            company_name: "Codezee Solutions PVT Ltd.",
            loan_policy_code: "ALC004",
            loan_policy_name: "Personal65",
            description: "Short-term personal loan category",
            is_approval_required: true,
            action_by: "Demo Demo",
            action_at: "2025-03-13T06:53:11.523Z",
            full_count: "2",
          },
        ],
      },
    },
    { status: 201 }
  );
}
