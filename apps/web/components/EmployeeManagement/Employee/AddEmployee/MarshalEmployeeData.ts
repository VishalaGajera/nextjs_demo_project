import type { DocumentFormFieldValues } from "./Document/Dialog/DocumentForm";
import {
  AADHAAR_CARD,
  DEGREE_AND_CERTIFICATE,
  DRIVING_LICENSE,
  PAN_CARD,
  PREVIOUS_EXPERIENCE,
  VOTER_ID,
} from "./Document/Dialog/hooks/constant";
import type { EmployeeFormFieldValues } from "./EmployeeForm";

export const marshalDocumentPayload = (
  documentList: DocumentFormFieldValues[]
) => {
  const getDocumentDetail = ({
    document_type,
    name,
    document_no,
    date_of_birth,
    address,
    gender,
    blood_group,
    issue_date,
    expiry_date,
    company_name,
    job_title,
    joining_date,
    relieving_date,
    degree,
    branch_name,
    joining_year,
    completion_year,
    cgpa_or_percentage,
    university_or_college,
    document_url,
  }: DocumentFormFieldValues) => {
    if (document_type === AADHAAR_CARD) {
      return {
        name,
        document_no,
        date_of_birth,
        address,
        document_url,
      };
    } else if (document_type === PAN_CARD) {
      return {
        name,
        document_no,
        date_of_birth,
        issue_date,
        address,
        document_url,
      };
    } else if (document_type === VOTER_ID) {
      return {
        name,
        document_no,
        date_of_birth,
        gender,
        document_url,
      };
    } else if (document_type === DRIVING_LICENSE) {
      return {
        name,
        document_no,
        date_of_birth,
        blood_group,
        issue_date,
        expiry_date,
        document_url,
      };
    } else if (document_type === PREVIOUS_EXPERIENCE) {
      return {
        company_name,
        job_title,
        joining_date,
        relieving_date,
        address,
        document_url,
      };
    } else if (document_type === DEGREE_AND_CERTIFICATE) {
      return {
        degree,
        branch_name,
        joining_year,
        completion_year,
        cgpa_or_percentage: cgpa_or_percentage
          ? cgpa_or_percentage.toString()
          : null,
        university_or_college,
        document_url,
      };
    }

    return { name, document_url };
  };

  return documentList.map((document) => {
    const { document_type } = document;

    return {
      document_type,
      document_details: getDocumentDetail(document),
    };
  });
};

export const marshalEmployeePayload = (
  employee: EmployeeFormFieldValues,
  documents: DocumentFormFieldValues[]
) => {
  const {
    employee_code_type,
    employee_code_id,
    employee_code,
    punch_code,
    title,
    first_name,
    middle_name,
    last_name,
    nick_name,
    date_of_birth,
    gender,
    joining_date,
    on_book_joining_date,
    confirmation_date,
    avatar,
    mobile_no,
    email,
    company_id,
    business_unit_id,
    business_unit_location_id,
    department_id,
    sub_department_id,
    designation_id,
    grade_id,
    work_type_id,
    skill_type_id,
    reporting_manager_id,
    attendance_penalty_rule_id,
    overtime_rule_id,
    leave_plan_id,
    weekly_off_type_id,
    shift_type_id,
    bank_shift_type_id,
    holiday_group_id,
  } = employee;

  const payload = {
    basic_details: {
      title,
      first_name,
      middle_name,
      last_name,
      nick_name,
      date_of_birth,
      gender,
      joining_date,
      on_book_joining_date,
      confirmation_date,
      avatar,
      mobile_no,
      email,
    },
    work_details: {
      company_id,
      business_unit_id,
      business_unit_location_id,
      employee_code_type,
      employee_code_id,
      employee_code,
      punch_code,
      department_id,
      sub_department_id,
      designation_id,
      grade_id,
      work_type_id,
      skill_type_id,
      reporting_manager_id,
      attendance_penalty_rule_id,
      overtime_rule_id,
      leave_plan_id,
      weekly_off_type_id,
      shift_type_id,
      bank_shift_type_id,
      holiday_group_id,
      assigned_roles: ["12893258-64ab-487c-8daa-3de11d0b0f1c"],
    },
    document_details: documents,
  };

  return payload;
};
