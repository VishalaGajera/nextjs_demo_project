import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import type { AgColumnsWithActions } from "../../../../../../../../types/agGrid";
import { type OptionsType } from "../../../../../../../../types/options";
import { accountTypeOptions } from "../../../../../../../common/Autocomplete/AccountTypeAutoComplete";
import { useGetBankOptions } from "../../../../../../../common/Autocomplete/hooks/useGetBankOptions";
import { useGetBankShiftOptions } from "../../../../../../../common/Autocomplete/hooks/useGetBankShiftSchemeOptions";
import { useGetBusinessUnitOptions } from "../../../../../../../common/Autocomplete/hooks/useGetBusinessUnitOptions";
import { useGetDepartmentOptions } from "../../../../../../../common/Autocomplete/hooks/useGetDepartmentOptions";
import { useGetDesignationOptions } from "../../../../../../../common/Autocomplete/hooks/useGetdesignationsOptions";
import { useGetEmployeeCodeOptions } from "../../../../../../../common/Autocomplete/hooks/useGetEmployeeCodeOptions";
import { useGetEmployeeOption } from "../../../../../../../common/Autocomplete/hooks/useGetEmployeeOption";
import { useGetGenderOptions } from "../../../../../../../common/Autocomplete/hooks/useGetGenderOptions";
import { useGetGradeOptions } from "../../../../../../../common/Autocomplete/hooks/useGetGradeOptions";
import { useGetHolidaySchemaOptions } from "../../../../../../../common/Autocomplete/hooks/useGetHolidaySchemaOptions";
import { useGetLeavePlanOptions } from "../../../../../../../common/Autocomplete/hooks/useGetLeavePlansOptions";
import { usePenaltyRuleOptions } from "../../../../../../../common/Autocomplete/hooks/useGetPenaltyRuleOptions";
import { useGetShiftOptions } from "../../../../../../../common/Autocomplete/hooks/useGetShiftSchemeOptions";
import { useGetSkillTypeOptions } from "../../../../../../../common/Autocomplete/hooks/useGetSkillTypeOptions";
import { useGetTitleOptions } from "../../../../../../../common/Autocomplete/hooks/useGetTitleOptions";
import { useGetWeeklyOffSchemaOptions } from "../../../../../../../common/Autocomplete/hooks/useGetWeeklyOffSchemaOptions";
import { useGetWorkTypeOptions } from "../../../../../../../common/Autocomplete/hooks/useGetWorkTypeOptions";
import { useOvertimeRuleOptions } from "../../../../../../../common/Autocomplete/hooks/useOvertimeRuleOptions";
import { paymentTypeOption } from "../../../../../../../common/Autocomplete/PaymentTypeAutoComplete";
import type {
  ExcelMappedOptions,
  ExcelRowsData,
} from "../../../ExcelImportProcess";
import type { ValidationSchema } from "../../common/AddEmployeeSchema";
import { createDynamicZodSchema } from "../../common/AddEmployeeSchema";
import { AutocompleteCellRenderer } from "../../common/AutocompleteCellRenderer";
import { CheckBoxCellRenderer } from "../../common/CheckBoxCellRenderer";
import { DatePickerCellRenderer } from "../../common/DatePickerCellRenderer";
import { PhoneInputFieldCellRenderer } from "../../common/PhoneInputFieldCellRenderer";
import { TextCellRenderer } from "../../common/TextCellRenderer";
import { EMPLOYEE } from "../../constant";
import { useUpdateFormValues } from "../../hooks/useUpdateFormValues";
import { BusinessUnitAutocomplete } from "../BusinessUnitAutocomplete";
import EmployeeFormSchema from "../config.json";
import { DepartmentAutocomplete } from "../DepartmentAutocomplete";
import { EmployeeCodeTypeAutocomplete } from "../EmployeeCodeTypeAutocomplete";
import { LocationAutocomplete } from "../LocationAutocomplete";
import { PaymentTypeAutocomplete } from "../PaymentTypeAutocomplete";
import { ReportingManagerAutoComplete } from "../ReportingManagerAutoComplete";
import { SubDepartmentAutocomplete } from "../SubDepartmentAutocomplete";

type UseAddEmployeePreviewColumnsArgs = {
  loading: boolean;
  companyId: string;
  setLoading: (value: boolean) => void;
  excelRowsData: ExcelRowsData;
  excelMappedOptions: ExcelMappedOptions;
};

export const schema = createDynamicZodSchema(
  EmployeeFormSchema as ValidationSchema,
  EMPLOYEE
);

export type EmployeeFormFieldValues = z.infer<typeof schema>;

export const useAddEmployeePreviewColumns = ({
  loading = false,
  companyId,
  setLoading,
  excelRowsData,
  excelMappedOptions,
}: UseAddEmployeePreviewColumnsArgs) => {
  const { t } = useTranslation();

  const form = useForm<EmployeeFormFieldValues>({
    values: { [EMPLOYEE]: excelRowsData as [{ [key: string]: unknown }] },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const {
    control,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = form;

  const employeeCodeTypeOptions = [
    { label: "Auto", value: "auto" },
    { label: "Manual", value: "manual" },
  ];

  const { titleOptions } = useGetTitleOptions();

  const { genderOptions } = useGetGenderOptions();

  useEnableDisableButtonToggle({
    errors,
    isFormChanged: true,
    buttonId: submitButtonId,
  });

  const { data: businessUnitOptions, isFetching: businessUnitLoading } =
    useGetBusinessUnitOptions({
      companyId,
    });

  const { data: employeeCodeOptions, isFetching: employeeCodeLoading } =
    useGetEmployeeCodeOptions({
      companyId,
    });

  const { data: departmentOptions, isFetching: departmentLoading } =
    useGetDepartmentOptions({
      companyId,
    });

  const { data: designationOptions, isFetching: designationLoading } =
    useGetDesignationOptions({
      companyId,
    });

  const { data: gradeOptions, isFetching: gradeLoading } = useGetGradeOptions({
    companyId,
  });

  const { data: workTypeOptions, isFetching: workTypeLoading } =
    useGetWorkTypeOptions({
      companyId,
    });

  const { data: skillTypeOptions, isFetching: skillTypeLoading } =
    useGetSkillTypeOptions({
      companyId,
    });

  const { data: reportingMemberOptions, isFetching: reportingMemberLoading } =
    useGetEmployeeOption({
      companyId,
      queryParams: {
        avatar: true,
      },
    });

  const { data: ShiftSchemeOptions, isFetching: ShiftSchemeLoading } =
    useGetShiftOptions({
      companyId,
    });

  const { data: bankShiftSchemeOptions, isFetching: bankShiftSchemeLoading } =
    useGetBankShiftOptions({
      companyId,
    });

  const { data: weeklyOffSchemeOptions, isFetching: weeklyOffSchemeLoading } =
    useGetWeeklyOffSchemaOptions({
      companyId,
    });

  const { data: holidaySchemeOptions, isFetching: holidaySchemeLoading } =
    useGetHolidaySchemaOptions({
      companyId,
    });

  const { data: penaltyRuleOptions, isFetching: penaltyRuleLoading } =
    usePenaltyRuleOptions({
      companyId,
    });

  const { data: overtimeRuleOptions, isFetching: overtimeRuleLoading } =
    useOvertimeRuleOptions({
      companyId,
    });

  const { data: leavePlanOptions, isFetching: leavePlanLoading } =
    useGetLeavePlanOptions({
      companyId,
    });

  const { data: bankOptions, isFetching: bankLoading } = useGetBankOptions();

  useMemo(() => {
    if (
      !businessUnitLoading &&
      !employeeCodeLoading &&
      !departmentLoading &&
      !designationLoading &&
      !gradeLoading &&
      !workTypeLoading &&
      !skillTypeLoading &&
      !reportingMemberLoading &&
      !ShiftSchemeLoading &&
      !bankShiftSchemeLoading &&
      !weeklyOffSchemeLoading &&
      !holidaySchemeLoading &&
      !penaltyRuleLoading &&
      !overtimeRuleLoading &&
      !leavePlanLoading &&
      !bankLoading
    ) {
      setLoading(false);
    } else if (
      !loading &&
      (businessUnitLoading ||
        employeeCodeLoading ||
        departmentLoading ||
        designationLoading ||
        gradeLoading ||
        workTypeLoading ||
        skillTypeLoading ||
        reportingMemberLoading ||
        ShiftSchemeLoading ||
        bankShiftSchemeLoading ||
        weeklyOffSchemeLoading ||
        holidaySchemeLoading ||
        penaltyRuleLoading ||
        overtimeRuleLoading ||
        leavePlanLoading ||
        bankLoading)
    ) {
      setLoading(true);
    }
  }, [
    businessUnitLoading,
    employeeCodeLoading,
    departmentLoading,
    designationLoading,
    gradeLoading,
    workTypeLoading,
    skillTypeLoading,
    reportingMemberLoading,
    ShiftSchemeLoading,
    bankShiftSchemeLoading,
    weeklyOffSchemeLoading,
    holidaySchemeLoading,
    penaltyRuleLoading,
    overtimeRuleLoading,
    leavePlanLoading,
    bankLoading,
  ]);

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: titleOptions,
    field: "title",
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: genderOptions,
    field: "gender",
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: businessUnitOptions,
    field: "business_unit_id",
    loading: businessUnitLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: employeeCodeTypeOptions,
    field: "employee_code_type",
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: employeeCodeOptions,
    field: "employee_code_id",
    loading: employeeCodeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: departmentOptions,
    field: "department_id",
    loading: departmentLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: designationOptions,
    field: "designation_id",
    loading: designationLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: gradeOptions,
    field: "grade_id",
    loading: gradeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: workTypeOptions,
    field: "work_type_id",
    loading: workTypeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: skillTypeOptions,
    field: "skill_type_id",
    loading: skillTypeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: reportingMemberOptions,
    field: "reporting_manager_id",
    loading: reportingMemberLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: ShiftSchemeOptions,
    field: "shift_type_id",
    loading: ShiftSchemeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: bankShiftSchemeOptions,
    field: "bank_shift_type_id",
    loading: bankShiftSchemeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: weeklyOffSchemeOptions,
    field: "weekly_off_type_id",
    loading: weeklyOffSchemeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: holidaySchemeOptions,
    field: "holiday_group_id",
    loading: holidaySchemeLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: penaltyRuleOptions,
    field: "attendance_penalty_rule_id",
    loading: penaltyRuleLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: overtimeRuleOptions,
    field: "overtime_rule_id",
    loading: overtimeRuleLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: leavePlanOptions,
    field: "leave_plan_id",
    loading: leavePlanLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: paymentTypeOption,
    field: "payment_type",
    loading: bankLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: bankOptions,
    field: "bank_id",
    loading: bankLoading,
  });

  useUpdateFormValues({
    excelRowsData,
    masterCodeKey: EMPLOYEE,
    watch,
    setValue,
    options: accountTypeOptions,
    field: "account_type",
  });

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const optionsMap: Record<string, OptionsType[]> = {
    title: titleOptions,
    gender: genderOptions,
    business_unit_id: businessUnitOptions,
    employee_code_type: employeeCodeTypeOptions,
    employee_code_id: employeeCodeOptions,
    department_id: departmentOptions,
    designation_id: designationOptions,
    grade_id: gradeOptions,
    work_type_id: workTypeOptions,
    skill_type_id: skillTypeOptions,
    reporting_manager_id: reportingMemberOptions,
    shift_type_id: ShiftSchemeOptions,
    bank_shift_type_id: bankShiftSchemeOptions,
    weekly_off_type_id: weeklyOffSchemeOptions,
    holiday_group_id: holidaySchemeOptions,
    attendance_penalty_rule_id: penaltyRuleOptions,
    overtime_rule_id: overtimeRuleOptions,
    leave_plan_id: leavePlanOptions,
    payment_type: paymentTypeOption,
    bank_id: bankOptions,
    account_type: accountTypeOptions,
  };

  const getOptions = (type: string) => optionsMap[type] || [];

  const defaultColumnField = {
    minWidth: 240,
    autoHeight: true,
    cellRenderer: TextCellRenderer,
    cellRendererParams: {
      control,
      masterCodeKey: EMPLOYEE,
    },
  };

  const getError = (index: number, fieldName: string) => {
    return errors[EMPLOYEE]?.[index]?.[fieldName];
  };

  const column: AgColumnsWithActions<ExcelRowsData[number]> = excelMappedOptions
    // eslint-disable-next-line sonarjs/cognitive-complexity
    .map((column) => {
      if (column.field_type === "text_field") {
        if (column.value === "employee_code") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                fieldName: column.value,
                disabled:
                  watch(
                    `${EMPLOYEE}.${node.rowIndex ?? 0}.employee_code_type`
                  ) !== "manual",
              };
            },
          };
        } else if (
          column.value === "branch_name" ||
          column.value === "account_no" ||
          column.value === "ifsc_code" ||
          column.value === "name_as_per_bank"
        ) {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                watch,
                fieldName: column.value,
                disabled:
                  watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.payment_type`) !==
                  "bank",
              };
            },
          };
        }

        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
              fieldName: column.value,
            };
          },
        };
      } else if (column.field_type === "auto_complete") {
        if (column.value === "employee_code_type") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: EmployeeCodeTypeAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                errors,
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                watch,
                setValue,
                clearErrors,
              };
            },
          };
        } else if (column.value === "employee_code_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: AutocompleteCellRenderer,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                disabled:
                  watch(
                    `${EMPLOYEE}.${node.rowIndex ?? 0}.employee_code_type`
                  ) !== "auto",
              };
            },
          };
        } else if (column.value === "business_unit_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: BusinessUnitAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                errors,
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                watch,
                setValue,
                clearErrors,
              };
            },
          };
        } else if (column.value === "business_unit_location_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: LocationAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                disabled: !watch(
                  `${EMPLOYEE}.${node.rowIndex ?? 0}.business_unit_id`
                ),
                watch,
                setValue,
                loading: businessUnitLoading,
              };
            },
          };
        } else if (column.value === "department_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: DepartmentAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                errors,
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                watch,
                setValue,
                clearErrors,
              };
            },
          };
        } else if (column.value === "sub_department_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: SubDepartmentAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                disabled: !watch(
                  `${EMPLOYEE}.${node.rowIndex ?? 0}.department_id`
                ),
                watch,
                setValue,
                loading: departmentLoading,
              };
            },
          };
        } else if (column.value === "payment_type") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: PaymentTypeAutocomplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                errors,
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                watch,
                setValue,
                clearErrors,
              };
            },
          };
        } else if (column.value === "reporting_manager_id") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: ReportingManagerAutoComplete,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
              };
            },
          };
        } else if (
          column.value === "bank_id" ||
          column.value === "account_type"
        ) {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: AutocompleteCellRenderer,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                disabled:
                  watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.payment_type`) !==
                  "bank",
              };
            },
          };
        }

        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: AutocompleteCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              options: getOptions(column.value),
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
            };
          },
        };
      } else if (column.field_type === "date_picker") {
        if (column.value === "date_of_birth") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: DatePickerCellRenderer,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                maxDate: watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.joining_date`)
                  ? DateTime.fromISO(
                      watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.joining_date`)
                    )
                  : DateTime.now(),
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                setError,
              };
            },
          };
        } else if (column.value === "joining_date") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: DatePickerCellRenderer,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                minDate:
                  watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.date_of_birth`) &&
                  DateTime.fromISO(
                    watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.date_of_birth`)
                  ),
                maxDate:
                  watch(
                    `${EMPLOYEE}.${node.rowIndex ?? 0}.on_book_joining_date`
                  ) &&
                  DateTime.fromISO(
                    watch(
                      `${EMPLOYEE}.${node.rowIndex ?? 0}.on_book_joining_date`
                    )
                  ),
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                setError,
              };
            },
          };
        } else if (column.value === "on_book_joining_date") {
          return {
            ...defaultColumnField,
            headerName: column.label,
            field: column.value,
            cellRenderer: DatePickerCellRenderer,
            cellRendererParams: ({ node }: CustomCellRendererProps) => {
              return {
                ...defaultColumnField.cellRendererParams,
                options: getOptions(column.value),
                fieldName: column.value,
                minDate:
                  watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.joining_date`) &&
                  DateTime.fromISO(
                    watch(`${EMPLOYEE}.${node.rowIndex ?? 0}.joining_date`)
                  ),
                error: getError(node.rowIndex ?? 0, column.value),
                errorMessage: errorMessages(
                  getError(node.rowIndex ?? 0, column.value)?.message as string
                ),
                setError,
              };
            },
          };
        }

        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: DatePickerCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
              setError,
            };
          },
        };
      } else if (column.field_type === "check_box") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: CheckBoxCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              fieldName: column.value,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
            };
          },
        };
      } else if (column.field_type === "phone_input_field") {
        return {
          ...defaultColumnField,
          headerName: column.label,
          field: column.value,
          cellRenderer: PhoneInputFieldCellRenderer,
          cellRendererParams: ({ node }: CustomCellRendererProps) => {
            return {
              ...defaultColumnField.cellRendererParams,
              error: getError(node.rowIndex ?? 0, column.value),
              errorMessage: errorMessages(
                getError(node.rowIndex ?? 0, column.value)?.message as string
              ),
              fieldName: column.value,
            };
          },
        };
      }
    })
    .filter((col) => !!col);

  return { column, form, setError };
};
