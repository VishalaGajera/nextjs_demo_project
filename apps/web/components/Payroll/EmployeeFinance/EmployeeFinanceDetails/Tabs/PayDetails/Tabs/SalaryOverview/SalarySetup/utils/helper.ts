import { capitalize } from "lodash";
import { DateTime } from "luxon";
import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { z } from "zod";
import type { ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import type { OptionsType } from "../../../../../../../../../../types/options";
import {
  filterNestedChangedFormFields,
  validateMaxDigit,
} from "../../../../../../../../../../utils/helper";
import type {
  SalaryStructureCategory,
  SalaryStructureDataItem,
} from "../../../../../../../../../common/Autocomplete/EmployeeFinance/Hooks/useGetSalaryStructureOptions";
import type { EmployeeFinanceListType } from "../../../../../../../EmployeeFinanceList/Hooks/useGetEmployeeFinanceList";
import type { SalarySetupSchemaType } from "../AddSalarySetupForm";
import type { AddSalarySetupApiPayload } from "../Hooks/useAddSalarySetup";
import type { CustomSalaryDetails } from "../Hooks/useGetSalaryCustomDetails";
import type { SalaryRangeDetails } from "../Hooks/useGetSalaryRangesDetails";

const initialEmployeeData = {
  id: "",
  employee_code: "",
  punch_code: "",
  avatar: "",
  employee_name: "",
  department_name: "",
  sub_department_name: "",
  designation_name: "",
  reporting_manager_name: "",
  salary: null,
  reporting_manager_avatar: "",
  full_count: "",
  company_id: "",
  joining_date: "",
};

export const initialAutocompleteOptions = [
  {
    label: "",
    value: "",
    disabled: false,
  },
];

const salaryStructureCategoryOptions = {
  ranges: [
    {
      label: { from_range: 0, to_range: 0 },
      value: "",
    },
  ],
  custom: initialAutocompleteOptions,
};

export const initialSalaryStructureOptions: SalaryStructureDataItem = {
  options: {
    label: "Default",
    value: {
      monthly: salaryStructureCategoryOptions,
      daily: salaryStructureCategoryOptions,
      hourly: salaryStructureCategoryOptions,
      annually: salaryStructureCategoryOptions,
    },
  },
};

type AddSalarySetupArgs = {
  dirtyFields: FieldNamesMarkedBoolean<AddSalarySetupApiPayload>;
  formValues: SalarySetupSchemaType;
};

type GetEmployeeArgs = {
  employeeFinances: EmployeeFinanceListType[];
  employeeId: string;
};

type GetRangeIdArgs = {
  salaryRangesOptions: OptionsType[];
  structureType: keyof SalaryStructureCategory;
  salary: number;
};

type FilterCustomDetailsArgs = {
  salaryCustomDetails: ApiSuccessResponse<CustomSalaryDetails>;
};

type FilterRangesDetailsArgs = {
  salaryRangeDetails: ApiSuccessResponse<SalaryRangeDetails[]>;
};

type CalculateTotalArgs = {
  allocations: SalarySetupSchemaType["salary_details"]["salary_component_allocations"];
  structureBy: SalarySetupSchemaType["structure_by"];
};

type ApplySuperRefineArgs = {
  value: SalarySetupSchemaType;
  ctx: z.RefinementCtx;
};

export const addSalarySetup = ({
  dirtyFields,
  formValues,
}: AddSalarySetupArgs) => {
  const pfJoiningDate = DateTime.fromISO(
    formValues.statutory_details.pf_joining_date ?? ""
  ).toISODate();

  const esicJoiningDate = DateTime.fromISO(
    formValues.statutory_details.esic_joining_date ?? ""
  ).toISODate();

  const { salary_details, salary_setup } = dirtyFields;

  const { salary_component_allocations } = salary_details ?? {};

  const filteredAllocations = salary_component_allocations?.map(
    (allocation) => {
      return { ...allocation, salary_component_name: false };
    }
  );

  const {
    pf_applicable,
    pf_account_no,
    pf_joining_date,
    uan_no,
    esic_applicable,
    esic_no,
    esic_joining_date,
    pt_applicable,
    lwf_applicable,
    tds_applicable,
    epf_group_id,
    esic_group_id,
    tax_regime_id,
  } = formValues.statutory_details;

  const filteredPayLoad = filterNestedChangedFormFields(formValues, {
    ...dirtyFields,
    structure_by: false,
    structure_type: false,
    custom_structure_name: false,
    is_enable_payroll: true,
    salary_details: {
      ...salary_details,
      salary_component_allocations: filteredAllocations,
      salary_structure_custom_id:
        formValues.structure_type === "custom" ? true : false,
      salary_structure_range_id:
        formValues.structure_type === "ranges" ? true : false,
    },
    salary_setup: {
      ...salary_setup,
      salary_calculation_type: true,
      hourly_calculation_type:
        formValues.salary_setup.salary_calculation_type === "hourly",
      target_hours:
        formValues.salary_setup.salary_calculation_type === "hourly" &&
        formValues.salary_setup.hourly_calculation_type === "employee_wise",
      effective_from: true,
    },
    statutory_details: {
      pf_applicable: !!pf_applicable,
      pf_account_no: !!pf_account_no,
      pf_joining_date: !!pf_joining_date,
      uan_no: !!uan_no,
      esic_applicable: !!esic_applicable,
      esic_no: !!esic_no,
      esic_joining_date: !!esic_joining_date,
      pt_applicable: !!pt_applicable,
      lwf_applicable: !!lwf_applicable,
      tds_applicable: !!tds_applicable,
      epf_group_id: !!epf_group_id,
      esic_group_id: !!esic_group_id,
      tax_regime_id: !!tax_regime_id,
    },
  });

  const payLoad = {
    ...filteredPayLoad,
    statutory_details: {
      ...filteredPayLoad.statutory_details,
      ...(esic_joining_date ? { esic_joining_date: esicJoiningDate } : {}),
      ...(pf_joining_date ? { pf_joining_date: pfJoiningDate } : {}),
    },
  };

  return { payLoad };
};

export const getEmployee = ({
  employeeFinances,
  employeeId,
}: GetEmployeeArgs) => {
  if (employeeFinances.length) {
    const employee = employeeFinances.find(
      (employee) => employee.id === employeeId
    );

    if (employee) {
      return employee;
    }
  }

  return initialEmployeeData;
};

export const getRangeId = ({
  salaryRangesOptions,
  structureType,
  salary,
}: GetRangeIdArgs) => {
  return structureType === "ranges" && salaryRangesOptions?.length
    ? salaryRangesOptions.find(({ label, value }) => {
        if (label) {
          const fromAmount = parseInt(label.split("-")[0] ?? "");

          const toAmount = parseInt(label.split("-")[1] ?? "");

          if (salary && salary >= fromAmount && salary <= toAmount) {
            return value;
          }
        }
      })
    : { value: "" };
};

export const filterCustomDetails = ({
  salaryCustomDetails,
}: FilterCustomDetailsArgs) => {
  if (!Array.isArray(salaryCustomDetails.data.salary_component_allocations)) {
    return [];
  }

  return salaryCustomDetails.data.salary_component_allocations.map(
    (allocation) => {
      return {
        salary_structure_component_allocation_id: allocation.id,
        salary_component_value:
          allocation.calculation_type === "fixed"
            ? (allocation.fixed_amount ?? 0)
            : (allocation.percentage_value ?? 0),
        salary_component_name: capitalize(
          allocation.salary_component.component_name
        ),
      };
    }
  );
};

export const filterRangesDetails = ({
  salaryRangeDetails,
}: FilterRangesDetailsArgs) => {
  return (
    salaryRangeDetails.data.map((allocation) => {
      return {
        salary_structure_component_allocation_id: allocation.id,
        salary_component_value:
          allocation.calculation_type === "fixed"
            ? (allocation.fixed_amount ?? 0)
            : (allocation.percentage_value ?? 0),
        salary_component_name: capitalize(
          allocation.salary_component.component_name
        ),
      };
    }) ?? []
  );
};

export const calculateTotal = ({
  allocations,
  structureBy,
}: CalculateTotalArgs) => {
  return allocations.reduce(
    (totals, allocation) => {
      const baseValue = allocation.salary_component_value ?? 0;

      const monthlyValue =
        structureBy === "annually"
          ? baseValue / 12
          : (() => {
              let monthlyValue = 0;

              if (structureBy === "monthly") {
                monthlyValue = baseValue;
              }

              return monthlyValue;
            })();

      const annualValue =
        structureBy === "monthly"
          ? baseValue * 12
          : (() => {
              if (structureBy === "annually") {
                return baseValue;
              }

              return 0;
            })();

      const otherValue =
        monthlyValue === 0 && annualValue === 0 ? baseValue : 0;

      return {
        monthly: parseFloat((totals.monthly + monthlyValue).toFixed(2)),
        annually: parseFloat((totals.annually + annualValue).toFixed(2)),
        other: parseFloat((totals.other + otherValue).toFixed(2)),
      };
    },
    { monthly: 0, annually: 0, other: 0 }
  );
};

export const SalarySetupInitialValues: SalarySetupSchemaType = {
  is_enable_payroll: true,
  salary_setup: {
    salary_calculation_type: "monthly",
    effective_from: "",
    salary: null,
    pay_schedule_group_id: "",
    hourly_calculation_type: "pay_schedule_wise",
    target_hours: null,
  },
  salary_details: {
    calculation_salary: null,
    salary_structure_id: "",
    salary_structure_custom_id: "",
    salary_structure_range_id: "",
    salary_component_allocations: [],
  },
  statutory_details: {
    pf_applicable: false,
    pf_account_no: null,
    pf_joining_date: null,
    uan_no: null,
    esic_applicable: false,
    esic_no: null,
    esic_joining_date: null,
    pt_applicable: false,
    lwf_applicable: false,
    tds_applicable: false,
    epf_group_id: "",
    esic_group_id: "",
    tax_regime_id: "",
  },
  custom_structure_name: "",
  structure_by: "monthly",
  structure_type: "custom",
};

export const applySuperRefine = ({ ctx, value }: ApplySuperRefineArgs) => {
  validateMaxDigit(ctx, "salary_setup.salary", value.salary_setup.salary);

  validateMaxDigit(
    ctx,
    "salary_details.calculation_salary",
    value.salary_details.calculation_salary
  );

  const requiredFields = [
    {
      condition: !value.salary_setup.salary,
      path: "salary_setup.salary",
    },
    {
      condition: !value.salary_setup.effective_from,
      path: "salary_setup.effective_from",
    },
    {
      condition:
        value.salary_setup.salary_calculation_type === "hourly" &&
        value.salary_setup.hourly_calculation_type === "employee_wise" &&
        !value.salary_setup.target_hours,
      path: "salary_setup.target_hours",
    },
    {
      condition:
        ["monthly", "daily"].includes(
          value.salary_setup.salary_calculation_type
        ) && !value.salary_setup.pay_schedule_group_id,
      path: "salary_setup.pay_schedule_group_id",
    },
    {
      condition:
        value.salary_setup.hourly_calculation_type === "pay_schedule_wise" &&
        ["hourly"].includes(value.salary_setup.salary_calculation_type) &&
        !value.salary_setup.pay_schedule_group_id,
      path: "salary_setup.pay_schedule_group_id",
    },
    { condition: !value.structure_by, path: "structure_by" },
    { condition: !value.structure_type, path: "structure_type" },
    {
      condition: !value.salary_details.calculation_salary,
      path: "salary_details.calculation_salary",
    },
    {
      condition:
        !value.salary_details.salary_structure_custom_id &&
        value.structure_type === "custom",
      path: "salary_details.salary_structure_custom_id",
    },
    {
      condition:
        !value.salary_details.salary_structure_range_id &&
        value.structure_type === "ranges",
      path: "salary_details.salary_structure_range_id",
    },
    {
      condition: !value.salary_details.salary_structure_id,
      path: "salary_details.salary_structure_id",
    },
  ];

  requiredFields.forEach(({ condition, path }) => {
    if (condition) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: [path],
      });
    }
  });

  value.salary_details.salary_component_allocations?.forEach(
    (allocation, index) => {
      if (allocation.salary_component_value === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: [
            `salary_details.salary_component_allocations.${index}.salary_component_value`,
          ],
        });
      }

      validateMaxDigit(
        ctx,
        `salary_details.salary_component_allocations.${index}.salary_component_value`,
        allocation.salary_component_value
      );
    }
  );
};
