import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Payment details history listed successfully.",
      data: {
        totalCount: 2,
        histories: [
          {
            payment_type: "bank",
            account_type: "saving",
            account_no: "0110040500000013",
            branch_name: "Yogi Chowk,surat",
            ifsc_code: "SBIN0018700",
            name_as_per_bank: null,
            bank_name: "State Bank of India",
            action_at: "2024-08-30T10:43:21.180Z",
            action_by: "Demo Demo",
            full_count: "9",
          },
          {
            payment_type: "cash",
            account_type: null,
            account_no: null,
            branch_name: null,
            ifsc_code: null,
            name_as_per_bank: null,
            bank_name: null,
            action_at: "2024-08-30T10:40:20.468Z",
            action_by: "Demo Demo",
            full_count: "9",
          },
        ],
      },
    },
    { status: 200 }
  );
}
