import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Excel Master options retrieved successfully.",
      data: [
        {
          value: "9fed5aee-333d-4649-b58e-3beb58998e2b",
          label: "Add Employees",
          master_code: "add_employees",
          is_company_required: true,
        },
        {
          value: "0cf3f6e2-3e52-4139-a3ed-9db0b2d460dd",
          label: "Emergency Contact Details",
          master_code: "emergency_contact_details",
          is_company_required: true,
        },
        {
          value: "4d884f49-99a9-4f0c-9200-728e755ad05a",
          label: "Family Details",
          master_code: "family_details",
          is_company_required: true,
        },
        {
          value: "3f08cda2-0911-42e1-b090-2ed12db57a19",
          label: "Employee Bank Details",
          master_code: "employee_bank_details",
          is_company_required: true,
        },
        {
          value: "c6f6e7de-e40c-4aba-85ba-b9b44dafb649",
          label: "Education Details",
          master_code: "education_details",
          is_company_required: true,
        },
        {
          value: "4a78566f-d09e-46b4-935a-ae7d24996024",
          label: "Employee Addresses",
          master_code: "employee_addresses",
          is_company_required: true,
        },
        {
          value: "c0f97b52-7f63-4a01-b0f3-c325264526ac",
          label: "Add Department",
          master_code: "add_department",
          is_company_required: true,
        },
        {
          value: "212aa1d5-aa03-495c-b8f0-48f464702c05",
          label: "Add Sub Department",
          master_code: "add_sub_department",
          is_company_required: true,
        },
        {
          value: "398f147e-6a28-40aa-8fdd-efc19868ca78",
          label: "Add Bank",
          master_code: "add_bank",
          is_company_required: false,
        },
        {
          value: "133c11fe-ab90-4534-b34d-6c22d75082f9",
          label: "Add Industry",
          master_code: "add_industry",
          is_company_required: false,
        },
        {
          value: "344acdff-dd97-4c53-99ac-029ff34619f7",
          label: "Add Designation",
          master_code: "add_designation",
          is_company_required: true,
        },
        {
          value: "bf82cd5e-4303-410d-9c5f-9316e4fa9b45",
          label: "Add Grade",
          master_code: "add_grade",
          is_company_required: true,
        },
        {
          value: "793e2c2a-6422-4430-a269-1424245fd6f9",
          label: "Add Skill Type",
          master_code: "add_skill_type",
          is_company_required: true,
        },
        {
          value: "a450384b-102a-4b30-ab12-167bd1b82d52",
          label: "Add Work Type",
          master_code: "add_work_type",
          is_company_required: true,
        },
        {
          value: "d5f15e5d-dfb9-4c86-b16f-5b393279c5dc",
          label: "Add Sub Caste",
          master_code: "add_sub_caste",
          is_company_required: true,
        },
        {
          value: "c87b5170-ed34-4dcc-bda5-2289bfd71daf",
          label: "Add Holiday",
          master_code: "add_holiday",
          is_company_required: false,
        },
        {
          value: "a62159a0-12a7-4435-8a32-06185ed288ce",
          label: "Add Employee Codes",
          master_code: "add_employee_codes",
          is_company_required: true,
        },
      ],
    },
    { status: 200 }
  );
}
