import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Company banks listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
        banks: [
          {
            id: "36a9fd10-0cfe-4e1a-9d84-f44c82925bc6",
            company_id: "0f5ec58c-a0b5-4918-8e02-d10205b5b414",
            company_name: "codezee",
            bank_id: "4b32c428-117c-4242-a53c-09839602375c",
            bank_name: "Savings Bank",
            branch_name: "KORMANGALAA",
            ifsc_code: "HDFC0001234",
            account_no: "6543210987654321",
            action_by: "Demo",
            action_at: "2024-07-16T09:45:30.446Z",
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
