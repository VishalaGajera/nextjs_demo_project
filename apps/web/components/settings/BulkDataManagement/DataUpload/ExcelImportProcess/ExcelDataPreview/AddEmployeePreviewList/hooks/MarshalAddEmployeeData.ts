import { DateTime } from "luxon";
import { removeNegationValues } from "../../../../../../../../utils/helper";
import type { EmployeeFormFieldValues } from "./useAddEmployeePreviewColumns";

export const marshalEmployeePayload = (
  employees: EmployeeFormFieldValues["employee"]
) => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const payload = employees.map((employee) => {
    const employeePayload = {
      basic_details: {
        title: employee.title ?? null,
        first_name: employee.first_name ?? null,
        middle_name: employee.middle_name ?? null,
        last_name: employee.last_name ?? null,
        nick_name: employee.nick_name ?? null,
        date_of_birth:
          employee.date_of_birth &&
          DateTime.fromISO(employee.date_of_birth).toISODate(),
        gender: employee.gender ?? null,
        joining_date:
          employee.joining_date &&
          DateTime.fromISO(employee.joining_date).toISODate(),
        on_book_joining_date:
          employee.on_book_joining_date &&
          DateTime.fromISO(employee.on_book_joining_date).toISODate(),
        confirmation_date:
          employee.confirmation_date &&
          DateTime.fromISO(employee.confirmation_date).toISODate(),
        avatar: employee.avatar ?? null,
        mobile_no: employee.mobile_no ?? null,
        email: employee.email ?? null,
      },
      work_details: {
        business_unit_id: employee.business_unit_id ?? null,
        business_unit_location_id: employee.business_unit_location_id ?? null,
        employee_code_type: employee.employee_code_type ?? null,
        employee_code_id: employee.employee_code_id ?? null,
        employee_code: employee.employee_code ?? null,
        punch_code: employee.punch_code ?? null,
        department_id: employee.department_id ?? null,
        sub_department_id: employee.sub_department_id ?? null,
        designation_id: employee.designation_id ?? null,
        grade_id: employee.grade_id ?? null,
        work_type_id: employee.work_type_id ?? null,
        skill_type_id: employee.skill_type_id ?? null,
        reporting_manager_id: employee.reporting_manager_id ?? null,
        attendance_penalty_rule_id: employee.attendance_penalty_rule_id ?? null,
        overtime_rule_id: employee.overtime_rule_id ?? null,
        leave_plan_id: employee.leave_plan_id ?? null,
        weekly_off_type_id: employee.weekly_off_type_id ?? null,
        shift_type_id: employee.shift_type_id ?? null,
        bank_shift_type_id: employee.bank_shift_type_id ?? null,
        holiday_group_id: employee.holiday_group_id ?? null,
        assigned_roles: employee.assigned_roles
          ? [employee.assigned_roles]
          : [],
      },
      payment_details: {
        payment_type: employee.payment_type ?? null,
        bank_id: employee.payment_type === "bank" ? employee.bank_id : null,
        branch_name:
          employee.payment_type === "bank" ? employee.branch_name : null,
        account_no:
          employee.payment_type === "bank" ? employee.account_no : null,
        ifsc_code: employee.payment_type === "bank" ? employee.ifsc_code : null,
        account_type:
          employee.payment_type === "bank" ? employee.account_type : null,
        name_as_per_bank:
          employee.payment_type === "bank" ? employee.name_as_per_bank : null,
      },
      statutory_details: {
        pf_applicable: employee.pf_applicable,
        pf_account_no: employee.pf_account_no,
        pf_joining_date: employee.pf_joining_date,
        uan_no: employee.uan_no,
        esic_applicable: employee.esic_applicable,
        esic_no: employee.esic_no,
        esic_joining_date: employee.esic_joining_date,
        pt_applicable: employee.pt_applicable,
        lwf_applicable: employee.lwf_applicable,
        tds_applicable: employee.tds_applicable,
      },
    };

    return removeNegationValues(employeePayload);
  });

  return payload;
};
