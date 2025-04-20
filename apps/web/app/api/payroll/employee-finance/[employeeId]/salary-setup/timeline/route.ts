import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Salary timeline fetched successfully",
    data: [
      {
        id: "1",
        is_enable_payroll: true,
        employee_id: "EMP123",
        salary_setup: {
          salary_calculation_type: "Monthly",
          effective_from: "2024-01-01",
          calculation_salary: 50000,
          pay_schedule_group_id: "PSG001",
          pay_schedule_group_name: "Monthly Payroll",
          hourly_calculation_type: null,
          target_hours: null,
        },
        salary_details: {
          id: "SAL123",
          salary: 50000,
          salary_structure_id: "SS001",
          salary_structure_name: "Standard Salary Structure",
          salary_structure_range_id: "SSR001",
          salary_structure_custom_id: null,
          salary_structure_custom_name: null,
          salary_component_allocations: [
            {
              id: "SCA001",
              salary_structure_component_allocation_id: "SSC001",
              salary_structure_component_allocation_name: "Basic",
              salary_component_value: 25000,
            },
            {
              id: "SCA002",
              salary_structure_component_allocation_id: "SSC002",
              salary_structure_component_allocation_name: "HRA",
              salary_component_value: 15000,
            },
            {
              id: "SCA003",
              salary_structure_component_allocation_id: "SSC003",
              salary_structure_component_allocation_name: "Other Allowance",
              salary_component_value: 10000,
            },
          ],
        },
        statutory_details: {
          pf_applicable: true,
          epf_group_id: "EPF001",
          pf_account_no: "PF123456",
          pf_joining_date: "2020-06-01",
          uan_no: "UAN789456",
          esic_applicable: true,
          esic_group_id: "ESIC001",
          esic_no: "ESIC123456",
          esic_joining_date: "2020-06-01",
          pt_applicable: true,
          lwf_applicable: false,
          tds_applicable: true,
          tax_section_id: "TAX001",
          tax_section_name: "Income Tax",
          epf_group_name: "EPF Group A",
          esic_group_name: "ESIC Group A",
        },
      },
    ],
  });
}
