import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee draft retrieved successfully.",
      data: {
        id: "c1775c36-c286-4820-9155-3d832fe60114",
        work_details: {
          grade_id: null,
          company_id: null,
          punch_code: null,
          work_type_id: null,
          department_id: null,
          skill_type_id: null,
          assigned_roles: ["12893258-64ab-487c-8daa-3de11d0b0f1c"],
          designation_id: null,
          salary_slab_id: null,
          leave_scheme_id: null,
          business_unit_id: null,
          sub_department_id: null,
          attendance_penalty_rule_id: null,
          overtime_rule_id: null,
          reporting_manager_id: null,
          shift_type_id: null,
          holiday_group_id: null,
          business_unit_location_id: null,
          weekly_off_type_id: null,
        },
        basic_details: {
          email: null,
          title: null,
          avatar: null,
          gender: null,
          last_name: "Gondaliya",
          mobile_no: null,
          nick_name: null,
          first_name: "Nikhil",
          middle_name: null,
          joining_date: null,
          date_of_birth: null,
          confirmation_date: null,
          on_book_joining_date: null,
        },
        payment_details: {
          bank_id: null,
          ifsc_code: null,
          account_no: null,
          branch_name: null,
          account_type: null,
          payment_type: "cash",
          name_as_per_bank: null,
        },
        document_details: [],
        statutory_details: {
          uan_no: null,
          esic_no: null,
          pf_account_no: null,
          pf_applicable: false,
          pt_applicable: false,
          lwf_applicable: false,
          tds_applicable: false,
          esic_applicable: false,
          pf_joining_date: null,
          esic_joining_date: null,
        },
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Employee draft updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Employee draft deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
