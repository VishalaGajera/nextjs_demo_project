import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Loans listed successfully.",
      data: {
        totalCount: 1,
        loans: [
          {
            id: "f64fd23d-ac82-4bc3-b51e-d57de55e543d",
            employee_name: "Hinal Rajput",
            employee_code: "10008",
            avatar:
              "https://sixtify.s3.amazonaws.com/1741670737272_images (2).jpg",
            employee_loan_id: "75cfc819-ade3-4cad-8f48-b400adb6c7d4",
            disbursement_date: "2024-06",
            repayment_start_date: "2024-12",
            interest_rate: 10,
            interest_calculation_type: "flat",
            amount: 1000,
            loan_category_name: "Personal65",
            total_interest: 2000,
            emi_amount: 1000,
            emi_terms_paid: 5,
            emi_terms_total: 12,
            status: "approved",
            last_action_by: null,
            last_action_at: null,
            last_action_remark: null,
            last_action_type: null,
            next_approvers: null,
            full_count: "1",
          },
        ],
      },
    },
    { status: 200 }
  );
}
