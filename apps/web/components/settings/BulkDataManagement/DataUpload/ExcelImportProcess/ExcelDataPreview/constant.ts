export const ADD_EMPLOYEE = "add_employee";
export const ADD_DEPARTMENT = "add_department";
export const ADD_SUB_DEPARTMENT = "add_sub_department";
export const ADD_DESIGNATION = "add_designation";
export const ADD_GRADE = "add_grade";
export const ADD_WORK_TYPE = "add_work_type";
export const ADD_SKILL_TYPE = "add_skill_type";
export const ADD_SUB_CASTE = "add_sub_caste";
export const ADD_HOLIDAY = "add_holiday";
export const ADD_BANK = "add_bank";
export const ADD_INDUSTRY = "add_industry";
export const ADD_EMPLOYEE_EMERGENCY_CONTACT =
  "add_employee_emergency_contact_details";
export const ADD_EMPLOYEE_FAMILY_DETAILS = "add_employee_family_details";
export const ADD_EMPLOYEE_EDUCATION_DETAILS = "add_employee_education_details";
export const ADD_EMPLOYEE_ADDRESS_DETAILS = "add_employee_address_details";

export const EMPLOYEE = "employee";
export const DEPARTMENT = "department";
export const SUB_DEPARTMENT = "subDepartment";
export const DESIGNATION = "designation";
export const GRADE = "grade";
export const WORK_TYPE = "workType";
export const SKILL_TYPE = "workType";
export const SUB_CASTE = "subCaste";
export const HOLIDAY = "holiday";
export const BANK = "bank";
export const INDUSTRY = "industry";
export const EMPLOYEE_EMERGENCY_CONTACT = "employeeEmergencyContact";
export const EMPLOYEE_FAMILY_DETAILS = "employeeFamilyDetails";
export const EMPLOYEE_EDUCATION_DETAILS = "employeeEducationDetails";
export const EMPLOYEE_ADDRESS_DETAILS = "employeeAddressDetails";

export const masterCodeOptions = {
  [ADD_EMPLOYEE]: EMPLOYEE,
  [ADD_DEPARTMENT]: DEPARTMENT,
  [ADD_SUB_DEPARTMENT]: SUB_DEPARTMENT,
  [ADD_DESIGNATION]: DESIGNATION,
  [ADD_GRADE]: GRADE,
  [ADD_WORK_TYPE]: WORK_TYPE,
  [ADD_SKILL_TYPE]: SKILL_TYPE,
  [ADD_SUB_CASTE]: SUB_CASTE,
  [ADD_HOLIDAY]: HOLIDAY,
  [ADD_BANK]: BANK,
  [ADD_INDUSTRY]: INDUSTRY,
  [ADD_EMPLOYEE_EMERGENCY_CONTACT]: EMPLOYEE_EMERGENCY_CONTACT,
  [ADD_EMPLOYEE_FAMILY_DETAILS]: EMPLOYEE_FAMILY_DETAILS,
  [ADD_EMPLOYEE_EDUCATION_DETAILS]: EMPLOYEE_EDUCATION_DETAILS,
  [ADD_EMPLOYEE_ADDRESS_DETAILS]: EMPLOYEE_ADDRESS_DETAILS,
};

export type MasterCodeOptionKeys = keyof typeof masterCodeOptions;

export type MasterCodeOptionValues =
  (typeof masterCodeOptions)[keyof typeof masterCodeOptions];
