import {
  Autocomplete,
  Button,
  DatePicker,
  FormContainer,
  FormGridLayout,
  FormRow,
  FormSection,
  PhoneInputField,
  RadioGroupField,
  TextField,
  toasts,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { debounce, isEmpty, merge } from "lodash";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import type { SubmitHandler, UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useApplicationContext } from "../../../../app/context/ApplicationContext";
import type { ButtonViewTypeKeys } from "../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import { departmentKeys } from "../../../../queryKeysFactories/department";
import { designationKeys } from "../../../../queryKeysFactories/designation";
import { employeeCodeKeys } from "../../../../queryKeysFactories/employeeCode";
import { gradeKeys } from "../../../../queryKeysFactories/grade";
import { skillTypeKeys } from "../../../../queryKeysFactories/skillType";
import { subDepartmentKeys } from "../../../../queryKeysFactories/subDepartment";
import { workTypeKeys } from "../../../../queryKeysFactories/worktype";
import type { DialogRenderer } from "../../../../types/dialogs";
import { dateDaysPlus, getAgeCalculate } from "../../../../utils/date";
import { onError } from "../../../../utils/errors";
import { Debounce_Delay, resetDependentFields } from "../../../../utils/helper";
import { isValidMobileNumber } from "../../../../utils/mobileNumberValidate";
import { emailRegex } from "../../../../utils/regex";
import { AttendancePenaltyRuleAutocomplete } from "../../../common/Autocomplete/AttendancePenaltyRuleAutocomplete";
import { BankShiftSchemaAutocomplete } from "../../../common/Autocomplete/BankShiftSchemaAutocomplete";
import { BusinessUnitAutocomplete } from "../../../common/Autocomplete/BusinessUnitAutocomplete";
import { DepartmentAutocomplete } from "../../../common/Autocomplete/DepartmentAutocomplete";
import { DesignationAutocomplete } from "../../../common/Autocomplete/DesignationAutocomplete";
import { EmployeeCodeAutocomplete } from "../../../common/Autocomplete/EmployeeCodeAutocomplete";
import { GenderAutocomplete } from "../../../common/Autocomplete/GenderAutoComplete";
import { GradeAutocomplete } from "../../../common/Autocomplete/GradeAutocomplete";
import { HolidaySchemeAutocomplete } from "../../../common/Autocomplete/HolidaySchemeAutocomplete";
import { useGetCompanyOptions } from "../../../common/Autocomplete/hooks/useGetCompanyOptions";
import { GenderTypeSchema } from "../../../common/Autocomplete/hooks/useGetGenderOptions";
import { TitleSchema } from "../../../common/Autocomplete/hooks/useGetTitleOptions";
import { LeavePlanAutocomplete } from "../../../common/Autocomplete/LeavePlanAutocomplete";
import { LocationAutocomplete } from "../../../common/Autocomplete/LocationAutocomplete";
import { OvertimeRuleAutocomplete } from "../../../common/Autocomplete/OvertimeRuleAutocomplete";
import { ReportingManagerAutoComplete } from "../../../common/Autocomplete/ReportingManagerAutoComplete";
import { ShiftSchemeAutocomplete } from "../../../common/Autocomplete/ShiftSchemeAutocomplete";
import { SkillTypeAutocomplete } from "../../../common/Autocomplete/SkillTypeAutocomplete";
import { SubDepartmentAutocomplete } from "../../../common/Autocomplete/SubDepartmentAutocomplete";
import { TitleAutocomplete } from "../../../common/Autocomplete/TitleAutocomplete";
import { WeeklyOffSchemeAutocomplete } from "../../../common/Autocomplete/WeeklyOffSchemeAutocomplete";
import { WorkTypeAutocomplete } from "../../../common/Autocomplete/WorkTypeAutocomplete";
import { ImageUploadField } from "../../../common/ImageUploadField";
import { AddDepartmentDialog } from "../../../settings/miscellaneous-data/department/Dialogs/AddDepartmentDialog";
import { AddDesignationDialog } from "../../../settings/miscellaneous-data/designation/Dialogs/AddDesignationDialog";
import { AddGradeDialog } from "../../../settings/miscellaneous-data/grade/Dialogs/AddGradeDialog";
import { AddSkillTypeDialog } from "../../../settings/miscellaneous-data/skill-type/Dialogs/AddSkillTypeDialog";
import { AddSubDepartmentDialog } from "../../../settings/miscellaneous-data/sub-department/Dialogs/AddSubDepartmentDialog";
import { AddWorkTypeDialog } from "../../../settings/miscellaneous-data/work-type/Dialogs/AddWorkTypeDialog";
import AddDraftEmployeeDialog from "./AddDraftEmployeeDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { AddDocumentDialog } from "./Document/Dialog/AddDocumentDialog";
import { DocumentFormObj } from "./Document/Dialog/DocumentForm";
import { AADHAAR_CARD, PAN_CARD } from "./Document/Dialog/hooks/constant";
import { useDocumentOptions } from "./Document/Dialog/hooks/useDocumentOptions";
import { DocumentList } from "./Document/DocumentList/DocumentList";
import { useAddEmployee } from "./hooks/useAddEmployee";
import { useGetGenerateNextCode } from "./hooks/useGetGenerateNextCode";
import {
  marshalDocumentPayload,
  marshalEmployeePayload,
} from "./MarshalEmployeeData";

const EmployeeCodeTypeSchema = z.enum(["auto", "manual"]);

const SaveTypeSchema = z.enum(["save", "draft"]);

const EmployeeFormSchema = z
  .object({
    submitType: SaveTypeSchema,
    avatar: z.string().optional().nullable(),
    employee_code_id: z.string().optional().nullable(),
    employee_code_type: EmployeeCodeTypeSchema,
    employee_code: z.string().optional().nullable(),
    punch_code: z.string().optional().nullable(),
    title: TitleSchema.optional().nullable(),
    first_name: z
      .string()
      .max(50, "employee.name.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    middle_name: z.string().max(50, "employee.name.maxLength").nullable(),
    last_name: z
      .string()
      .max(50, "employee.name.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    nick_name: z.string().optional().nullable(),
    date_of_birth: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    age: z.string().optional().nullable(),
    gender: GenderTypeSchema.optional().nullable(),
    joining_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    on_book_joining_date: z.string().nullable().nullable(),
    probation_period: z
      .number()
      .int("common.probationPeriodDecimalNumaberNotAllow.message")
      .max(1000, "common.probationPeriodLimitation.message")
      .nullable(),
    confirmation_date: z.string().nullable(),
    email: z
      .string()
      .trim()
      .regex(emailRegex, "common.email.invalid")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    mobile_no: z
      .string()
      .refine(isValidMobileNumber, {
        message: "common.mobileNumber.invalid",
      })
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    alternate_mobile_no: z
      .string()
      .refine(isValidMobileNumber, {
        message: "common.mobileNumber.invalid",
      })
      .nullable()
      .optional(),
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    business_unit_id: z.string().optional().nullable(),
    business_unit_location_id: z.string().optional().nullable(),
    department_id: z.string().optional().nullable(),
    sub_department_id: z.string().optional().nullable(),
    designation_id: z.string().optional().nullable(),
    grade_id: z.string().optional().nullable(),
    work_type_id: z.string().optional().nullable(),
    skill_type_id: z.string().optional().nullable(),
    reporting_manager_id: z.string().optional().nullable(),
    attendance_penalty_rule_id: z.string().optional().nullable(),
    overtime_rule_id: z.string().optional().nullable(),
    leave_plan_id: z.string().optional().nullable(),
    weekly_off_type_id: z.string().optional().nullable(),
    shift_type_id: z.string().optional().nullable(),
    bank_shift_type_id: z.string().optional().nullable(),
    holiday_group_id: z.string().optional().nullable(),
    assigned_roles: z.array(z.string()),
    document_details: z.array(DocumentFormObj).optional().nullable(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((val, ctx) => {
    if (val.joining_date && val.probation_period === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["probation_period"],
      });
    }

    if (
      val.employee_code_type === "auto" &&
      val.company_id &&
      !val.employee_code_id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["employee_code_id"],
      });
    } else if (val.employee_code_type === "manual" && !val.employee_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["employee_code"],
      });
    }

    if (val.company_id) {
      if (!val.business_unit_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["business_unit_id"],
        });
      }

      if (val.business_unit_id && !val.business_unit_location_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["business_unit_location_id"],
        });
      }

      if (!val.department_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["department_id"],
        });
      }

      if (!val.designation_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["designation_id"],
        });
      }

      if (val.department_id && !val.sub_department_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["sub_department_id"],
        });
      }

      if (isEmpty(val.reporting_manager_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["reporting_manager_id"],
        });
      }

      if (!val.shift_type_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["shift_type_id"],
        });
      }

      if (!val.bank_shift_type_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["bank_shift_type_id"],
        });
      }

      if (!val.weekly_off_type_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["weekly_off_type_id"],
        });
      }

      if (!val.holiday_group_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["holiday_group_id"],
        });
      }

      if (!val.leave_plan_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["leave_plan_id"],
        });
      }
    }
  });

const EmployeeFormDraftSchema = z.object({
  submitType: SaveTypeSchema,
  avatar: z.string().optional().nullable(),
  employee_code_id: z.string().optional().nullable(),
  employee_code_type: EmployeeCodeTypeSchema,
  employee_code: z.string().optional().nullable(),
  punch_code: z.string().optional().nullable(),
  title: TitleSchema.optional().nullable(),
  first_name: z
    .string()
    .max(50, "employee.name.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  middle_name: z.string().max(50, "employee.name.maxLength").nullable(),
  last_name: z
    .string()
    .max(50, "employee.name.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  nick_name: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  age: z.string().optional().nullable(),
  gender: GenderTypeSchema.optional().nullable(),
  joining_date: z.string().optional().nullable(),
  on_book_joining_date: z.string().optional().nullable(),
  probation_period: z
    .number()
    .int("Please enter a whole number. Decimals are not allowed.")
    .optional()
    .nullable(),
  confirmation_date: z.string().optional().nullable(),
  email: z
    .string()
    .trim()
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .optional(),
  mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .optional(),
  company_id: z.string().nullable().optional(),
  business_unit_id: z.string().optional().nullable(),
  business_unit_location_id: z.string().optional().nullable(),
  department_id: z.string().optional().nullable(),
  sub_department_id: z.string().optional().nullable(),
  designation_id: z.string().optional().nullable(),
  grade_id: z.string().optional().nullable(),
  work_type_id: z.string().optional().nullable(),
  skill_type_id: z.string().optional().nullable(),
  reporting_manager_id: z.string().optional().nullable(),
  attendance_penalty_rule_id: z.string().optional().nullable(),
  overtime_rule_id: z.string().optional().nullable(),
  leave_plan_id: z.string().optional().nullable(),
  weekly_off_type_id: z.string().optional().nullable(),
  shift_type_id: z.string().optional().nullable(),
  bank_shift_type_id: z.string().optional().nullable(),
  holiday_group_id: z.string().optional().nullable(),
  assigned_roles: z.array(z.string()),
  document_details: z.array(DocumentFormObj).optional().nullable(),
});

export type EmployeeFormFieldValues = z.infer<typeof EmployeeFormSchema>;

export const formDefaultValues: EmployeeFormFieldValues = {
  submitType: "save",
  employee_code_id: null,
  employee_code_type: "auto",
  employee_code: null,
  punch_code: null,
  title: null,
  first_name: null,
  middle_name: null,
  last_name: null,
  nick_name: null,
  date_of_birth: null,
  age: null,
  gender: null,
  joining_date: null,
  on_book_joining_date: null,
  confirmation_date: null,
  probation_period: null,
  email: null,
  mobile_no: null,
  alternate_mobile_no: null,
  avatar: null,
  company_id: null,
  business_unit_id: null,
  business_unit_location_id: null,
  department_id: null,
  sub_department_id: null,
  designation_id: null,
  grade_id: null,
  work_type_id: null,
  skill_type_id: null,
  reporting_manager_id: null,
  attendance_penalty_rule_id: null,
  overtime_rule_id: null,
  leave_plan_id: null,
  weekly_off_type_id: null,
  shift_type_id: null,
  bank_shift_type_id: null,
  assigned_roles: [],
  holiday_group_id: null,
  document_details: [],
};

type EmployeeFormArgs = {
  view: ButtonViewTypeKeys;
  isDraft: boolean;
  loading: boolean;
  employeeId?: Readonly<string>;
  defaultValues?: EmployeeFormFieldValues;
  onSaveDraftEmployee: (values: Partial<EmployeeFormFieldValues>) => void;
};

export type FormRef = {
  setError: UseFormSetError<EmployeeFormFieldValues>;
};

export const EmployeeForm = forwardRef(
  (
    {
      view,
      isDraft = false,
      loading = false,
      employeeId,
      defaultValues,
      onSaveDraftEmployee,
    }: EmployeeFormArgs,
    ref: ForwardedRef<FormRef>
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const { t } = useTranslation();

    const {
      isOpenAddEditEmployeePage,
      documentFormValues,
      employeeFormValues,
      setEmployeeFormValues,
      setDocumentFormValues,
      setIsOpenAddEditEmployeePage,
    } = useApplicationContext();

    const initialValues = useMemo(() => {
      if (!isEmpty(defaultValues)) {
        return { ...formDefaultValues, ...defaultValues };
      }

      return employeeFormValues;
    }, [defaultValues]);

    const { documentTypeOptions } = useDocumentOptions();

    const { data: companyOptions } = useGetCompanyOptions({
      queryParams: {
        employee_code_type: true,
      },
    });

    const router = useRouter();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const queryClient = useQueryClient();

    const dynamicResolver = (value: EmployeeFormFieldValues) => {
      return value.submitType === "save"
        ? zodResolver(EmployeeFormSchema)
        : zodResolver(EmployeeFormDraftSchema);
    };

    const {
      watch,
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
      reset,
      clearErrors,
      setValue: setFieldValue,
    } = useForm({
      values: initialValues,
      resolver: async (values, context, options) =>
        dynamicResolver(values)(values, context, options),
      mode: "all",
    });

    const employeeCodeId = watch("employee_code_id");

    const alternateMobileNo = watch("alternate_mobile_no");

    const { data: employeeNextCode } = useGetGenerateNextCode({
      employeeCodeId: employeeCodeId ?? "",
    });

    useMemo(() => {
      if (employeeNextCode) {
        setFieldValue("employee_code", employeeNextCode);

        clearErrors("employee_code");
      } else {
        setFieldValue("employee_code", "");
      }
    }, [employeeNextCode]);

    const debounceEmployeeFormValues = debounce((value) => {
      setEmployeeFormValues(value);
    }, Debounce_Delay);

    useEffect(() => {
      const subscription = watch((value) => {
        debounceEmployeeFormValues(value);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [watch]);

    const { mutate, isPending } = useAddEmployee({
      options: {
        onSuccess: (data) => {
          if (!isEmpty(documentFormValues)) {
            setDocumentFormValues([]);
          }

          setEmployeeFormValues(formDefaultValues);

          setIsOpenAddEditEmployeePage(false);

          toasts.success({ title: data.message });

          router.push(
            `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
          );
        },
        onError: (res) => {
          const { error, message } = res.response.data;

          const formattedError: EmployeeFormFieldValues = merge(
            error?.["basic_details"] ?? {},
            error?.["work_details"] ?? {},
            ...(error?.document_details
              ? [{ document_details: error.document_details }]
              : [])
          );

          const structuredError = {
            response: {
              data: {
                message,
                error: formattedError,
              },
            },
            status: res.status,
          };

          onError(structuredError, setError, [
            { document_details: "Document is invalid" },
          ]);
        },
      },
    });

    const employeeCodeType = watch("employee_code_type");

    useEffect(() => {
      if (employeeCodeId) {
        setFieldValue("employee_code_id", null);
      }
      setFieldValue("employee_code", "");

      clearErrors("employee_code");
    }, [employeeCodeType]);

    const companyId = watch("company_id") ?? "";

    const businessUnitId = watch("business_unit_id");

    const departmentId = watch("department_id");

    const joiningDate = watch("joining_date");

    const dateOfBirthDate = watch("date_of_birth");

    const onBookJoiningDate = watch("on_book_joining_date");

    const probationPeriod = watch("probation_period");

    const documentList = watch("document_details") || [];

    const confirmationDate = watch("confirmation_date");

    const employeeCodeTypeShow = useMemo(() => {
      if (companyId && companyOptions) {
        const selectedCompany = companyOptions.find(
          (company) => company.value === companyId
        );

        if (selectedCompany?.employee_code_generation_type) {
          setFieldValue(
            "employee_code_type",
            selectedCompany.employee_code_generation_type === "both"
              ? "auto"
              : selectedCompany.employee_code_generation_type
          );

          return selectedCompany.employee_code_generation_type;
        }
      }

      return null;
    }, [companyId, companyOptions]);

    const dependentFieldsMap: Partial<
      Record<keyof EmployeeFormFieldValues, (keyof EmployeeFormFieldValues)[]>
    > = {
      company_id: [
        "business_unit_id",
        "business_unit_location_id",
        "employee_code_id",
        "department_id",
        "sub_department_id",
        "designation_id",
        "grade_id",
        "work_type_id",
        "skill_type_id",
        "reporting_manager_id",
        "shift_type_id",
        "bank_shift_type_id",
        "weekly_off_type_id",
        "holiday_group_id",
        "attendance_penalty_rule_id",
        "overtime_rule_id",
        "leave_plan_id",
      ],
      business_unit_id: ["business_unit_location_id"],
      department_id: ["sub_department_id"],
    };

    useMemo(() => {
      resetDependentFields({
        fieldName: "company_id",
        fieldValue: companyId,
        dirtyFields,
        setValue: setFieldValue,
        dependentFieldsMap,
      });

      if (!companyId) {
        setFieldValue("employee_code", "");

        setFieldValue("employee_code_id", null);

        setFieldValue("employee_code_type", "auto");
      }
    }, [companyId]);

    useMemo(() => {
      resetDependentFields({
        fieldName: "business_unit_id",
        fieldValue: businessUnitId,
        dirtyFields,
        setValue: setFieldValue,
        dependentFieldsMap,
      });
    }, [businessUnitId]);

    useMemo(() => {
      resetDependentFields({
        fieldName: "department_id",
        fieldValue: departmentId,
        dirtyFields,
        setValue: setFieldValue,
        dependentFieldsMap,
      });
    }, [departmentId]);

    useEffect(() => {
      if (!isOpenAddEditEmployeePage) {
        setIsOpenAddEditEmployeePage(true);
      }

      if (!isEmpty(documentFormValues)) {
        setFieldValue("document_details", documentFormValues);
      }
    }, []);

    useMemo(() => {
      if (joiningDate && typeof probationPeriod === "number") {
        const confirmation = dateDaysPlus(joiningDate, probationPeriod);

        setFieldValue("confirmation_date", confirmation);
      } else if (joiningDate && confirmationDate) {
        setFieldValue("confirmation_date", null);
      }
    }, [joiningDate, probationPeriod]);

    useMemo(() => {
      if (!joiningDate) {
        setFieldValue("confirmation_date", null);

        setFieldValue("on_book_joining_date", null);

        setFieldValue("probation_period", null);

        clearErrors("probation_period");
      }
    }, [joiningDate]);

    useEffect(() => {
      setFieldValue(
        "age",
        dateOfBirthDate ? getAgeCalculate(dateOfBirthDate) : null
      );
    }, [dateOfBirthDate]);

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const submitAsDraft = () => {
      onDialogOpen("saveAsDraft");
    };

    // eslint-disable-next-line sonarjs/cognitive-complexity
    const onSubmit: SubmitHandler<EmployeeFormFieldValues> = (data) => {
      const documentDetailsPayload =
        (data.document_details &&
          !isEmpty(data.document_details) &&
          marshalDocumentPayload(data.document_details)) ||
        [];

      let isAadharCardAvailable = true;

      let isPanCardAvailable = true;

      documentDetailsPayload.forEach((document) => {
        if (document.document_type === AADHAAR_CARD) {
          isAadharCardAvailable = false;
        } else if (document.document_type === PAN_CARD) {
          isPanCardAvailable = false;
        }
      });

      if (data.submitType === "save") {
        if (isAadharCardAvailable && isPanCardAvailable) {
          toasts.error({
            title: t("employee.aadhaar_card_no_pan_card_no.invalid"),
          });

          return;
        } else if (isAadharCardAvailable) {
          toasts.error({
            title: t("employee.aadhaar_card_no.required"),
          });

          return;
        } else if (isPanCardAvailable) {
          toasts.error({
            title: t("employee.pan_card_no.required"),
          });

          return;
        }
      }

      const { reporting_manager_id, ...rest } = data;

      const updatedFormValues =
        reporting_manager_id === "no-reporting-manager"
          ? {
              ...rest,
              reporting_manager_id: null,
              alternate_mobile_no: alternateMobileNo ? alternateMobileNo : null,
            }
          : {
              ...data,
              alternate_mobile_no: alternateMobileNo ? alternateMobileNo : null,
            };

      const payload = marshalEmployeePayload(
        updatedFormValues,
        documentDetailsPayload
      );

      if (data.submitType === "save") {
        mutate({ ...payload, employee_draft_id: employeeId });
      } else {
        onSaveDraftEmployee(payload);
      }
    };

    useImperativeHandle(ref, () => ({
      setError,
    }));

    const dialogRenderer: DialogRenderer = {
      addDepartment: (
        <AddDepartmentDialog
          open
          defaultValues={{ company_id: companyId, is_active: true }}
          onClose={onDialogClose}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: departmentKeys.options(companyId),
            });
          }}
        />
      ),
      addSubDepartment: (
        <AddSubDepartmentDialog
          open
          onClose={onDialogClose}
          defaultValues={{
            company_id: companyId,
            department_id: departmentId,
            is_active: true,
          }}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: subDepartmentKeys.options(departmentId),
            });
          }}
        />
      ),
      addDocument: (
        <AddDocumentDialog
          open
          documentTypeOptions={documentTypeOptions}
          onClose={onDialogClose}
          onAdd={(formValues) => {
            setFieldValue("document_details", [...documentList, formValues]);

            setDocumentFormValues([...documentFormValues, formValues]);

            onDialogClose();
          }}
        />
      ),
      addSkillType: (
        <AddSkillTypeDialog
          open
          defaultValues={{ company_id: companyId, is_active: true }}
          onClose={onDialogClose}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: skillTypeKeys.options(companyId),
            });
          }}
        />
      ),
      addDesignation: (
        <AddDesignationDialog
          open
          defaultValues={{ company_id: companyId, is_active: true }}
          onClose={onDialogClose}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: designationKeys.options(companyId),
            });
          }}
        />
      ),
      addGrade: (
        <AddGradeDialog
          open
          defaultValues={{ company_id: companyId, is_active: true }}
          onClose={onDialogClose}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: gradeKeys.options(companyId),
            });
          }}
        />
      ),
      addWorkType: (
        <AddWorkTypeDialog
          open
          defaultValues={{ company_id: companyId, is_active: true }}
          onClose={onDialogClose}
          onAddSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: workTypeKeys.options(companyId),
            });
          }}
        />
      ),
      saveAsDraft: (
        <AddDraftEmployeeDialog
          open
          onDialogClose={onDialogClose}
          onSuccess={() => {
            reset();

            router.push(
              `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
            );
          }}
        />
      ),
      cancel: (
        <ConfirmationDialog
          open
          onClose={onDialogClose}
          onSave={() => {
            reset();

            if (!isEmpty(documentFormValues)) {
              setDocumentFormValues([]);
            }

            setEmployeeFormValues(formDefaultValues);

            setIsOpenAddEditEmployeePage(false);

            router.push(
              `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
            );
          }}
        />
      ),
    };

    const onRefreshEmployeeCode = () => {
      if (employeeCodeId) {
        queryClient.invalidateQueries({
          queryKey: employeeCodeKeys.generateNextCode(employeeCodeId),
        });
      }
    };

    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      joining_date,
      on_book_joining_date,
      probation_period,
      email,
      mobile_no,
      company_id,
      business_unit_id,
      business_unit_location_id,
      employee_code_id,
      employee_code,
      department_id,
      sub_department_id,
      designation_id,
      reporting_manager_id,
      shift_type_id,
      bank_shift_type_id,
      weekly_off_type_id,
      holiday_group_id,
      leave_plan_id,
    } = errors;

    return (
      <>
        <FormContainer>
          <FormSection title="Basic Details">
            <ImageUploadField
              variant="circle"
              name="avatar"
              loading={loading}
              control={control}
              isCapture
            />

            <FormRow>
              <TitleAutocomplete
                name="title"
                loading={loading}
                control={control}
              />

              <TextField
                name="first_name"
                control={control}
                loading={loading}
                label="First Name"
                required
                characterType="string"
                setError={setError}
                error={!!first_name}
                helperText={errorMessages(first_name?.message)}
              />

              <TextField
                name="middle_name"
                control={control}
                loading={loading}
                label="Middle Name"
                characterType="string"
                setError={setError}
                error={!!middle_name}
                helperText={errorMessages(middle_name?.message)}
              />
            </FormRow>

            <FormRow>
              <TextField
                name="last_name"
                control={control}
                loading={loading}
                label="Last Name"
                required
                characterType="string"
                setError={setError}
                error={!!last_name}
                helperText={errorMessages(last_name?.message)}
              />

              <TextField
                control={control}
                loading={loading}
                label="Nick Name"
                name="nick_name"
              />

              <GenderAutocomplete
                name="gender"
                control={control}
                loading={loading}
              />
            </FormRow>

            <FormRow>
              <DatePicker
                name="date_of_birth"
                setError={setError}
                control={control}
                loading={loading}
                label="Date of Birth"
                required
                maxDate={
                  joiningDate ? DateTime.fromISO(joiningDate) : DateTime.now()
                }
                error={!!date_of_birth}
                helperText={errorMessages(date_of_birth?.message)}
              />

              <TextField
                control={control}
                loading={loading}
                label="Age"
                name="age"
                disabled
              />

              <DatePicker
                name="joining_date"
                control={control}
                label="Date Of Joining"
                loading={loading}
                setError={setError}
                minDate={
                  dateOfBirthDate
                    ? DateTime.fromISO(dateOfBirthDate)
                    : undefined
                }
                maxDate={
                  onBookJoiningDate
                    ? DateTime.fromISO(onBookJoiningDate)
                    : undefined
                }
                required
                error={!!joining_date}
                helperText={errorMessages(joining_date?.message)}
              />
            </FormRow>

            <FormRow>
              <DatePicker
                name="on_book_joining_date"
                control={control}
                setError={setError}
                loading={loading}
                label="ON Books Join Date"
                minDate={
                  joiningDate ? DateTime.fromISO(joiningDate) : undefined
                }
                disabled={!joiningDate}
                error={!!on_book_joining_date}
                helperText={errorMessages(on_book_joining_date?.message)}
              />

              <TextField
                type="number"
                required
                control={control}
                loading={loading}
                label="Probation Period (Days)"
                name="probation_period"
                disabled={!joiningDate}
                error={!!probation_period}
                helperText={errorMessages(probation_period?.message)}
              />

              <DatePicker
                control={control}
                loading={loading}
                name="confirmation_date"
                label="Confirmation Date"
                disabled
              />
            </FormRow>

            <FormRow>
              <TextField
                name="email"
                control={control}
                loading={loading}
                label="Email"
                required
                letterCase="lowercase"
                error={!!email}
                helperText={errorMessages(email?.message)}
              />

              <PhoneInputField
                control={control}
                loading={loading}
                label="Mobile Number"
                name="mobile_no"
                required
                error={!!mobile_no}
                helperText={errorMessages(mobile_no?.message)}
              />
            </FormRow>
          </FormSection>

          <FormSection title="Employee Work & Post">
            <FormGridLayout columns={3}>
              {/* TODO:Manish - use a common component of company autocomplete */}
              <Autocomplete
                name="company_id"
                control={control}
                loading={loading}
                required
                label="Company"
                options={companyOptions}
                error={!!company_id}
                helperText={errorMessages(company_id?.message)}
              />

              <BusinessUnitAutocomplete
                name="business_unit_id"
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                required
                error={!!business_unit_id}
                helperText={errorMessages(business_unit_id?.message)}
                companyId={companyId}
              />

              <LocationAutocomplete
                name="business_unit_location_id"
                control={control}
                loading={loading}
                disabled={businessUnitId ? false : true}
                required
                error={!!business_unit_location_id}
                helperText={errorMessages(business_unit_location_id?.message)}
                businessUnitId={businessUnitId}
              />

              {employeeCodeTypeShow && (
                <RadioGroupField
                  name="employee_code_type"
                  label="Employee Code Type"
                  control={control}
                  loading={loading}
                  options={[
                    {
                      values: "auto",
                      label: "Auto",
                      disabled: false,
                    },
                    {
                      values: "manual",
                      label: "Manual",
                      disabled: false,
                    },
                  ]}
                />
              )}

              {employeeCodeType === "auto" && (
                <EmployeeCodeAutocomplete
                  disabled={companyId ? false : true}
                  name="employee_code_id"
                  control={control}
                  loading={loading}
                  required
                  error={!!employee_code_id}
                  helperText={errorMessages(employee_code_id?.message)}
                  companyId={companyId}
                />
              )}

              <TextField
                control={control}
                loading={loading}
                label={
                  employeeCodeType === "manual"
                    ? "Employee Code"
                    : "Next Generate Employee Code"
                }
                name="employee_code"
                disabled={employeeCodeType === "auto"}
                required
                error={!!employee_code}
                InputProps={
                  employeeCodeType === "auto"
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={onRefreshEmployeeCode}
                              disabled={!companyId || !employeeCodeId}
                            >
                              <CachedIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
                helperText={errorMessages(employee_code?.message)}
              />

              <TextField
                control={control}
                loading={loading}
                label="Punch Code"
                name="punch_code"
              />

              <DepartmentAutocomplete
                disabled={companyId ? false : true}
                name="department_id"
                onAction={() => onDialogOpen("addDepartment")}
                control={control}
                loading={loading}
                required
                error={!!department_id}
                helperText={errorMessages(department_id?.message)}
                companyId={companyId}
              />

              <SubDepartmentAutocomplete
                disabled={departmentId ? false : true}
                onAction={() => onDialogOpen("addSubDepartment")}
                name="sub_department_id"
                control={control}
                loading={loading}
                required
                error={!!sub_department_id}
                helperText={errorMessages(sub_department_id?.message)}
                departmentId={departmentId}
              />

              <DesignationAutocomplete
                disabled={companyId ? false : true}
                onAction={() => onDialogOpen("addDesignation")}
                name="designation_id"
                control={control}
                loading={loading}
                required
                error={!!designation_id}
                helperText={errorMessages(designation_id?.message)}
                companyId={companyId}
              />

              <GradeAutocomplete
                disabled={companyId ? false : true}
                name="grade_id"
                control={control}
                loading={loading}
                companyId={companyId}
                onAction={() => onDialogOpen("addGrade")}
              />

              <WorkTypeAutocomplete
                disabled={companyId ? false : true}
                name="work_type_id"
                control={control}
                loading={loading}
                companyId={companyId}
                onAction={() => onDialogOpen("addWorkType")}
              />

              <SkillTypeAutocomplete
                name="skill_type_id"
                onAction={() => onDialogOpen("addSkillType")}
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                companyId={companyId}
              />

              <ReportingManagerAutoComplete
                name="reporting_manager_id"
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                companyId={companyId}
                required
                error={!!reporting_manager_id}
                helperText={errorMessages(reporting_manager_id?.message)}
              />

              <ShiftSchemeAutocomplete
                name="shift_type_id"
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                companyId={companyId}
                required
                error={!!shift_type_id}
                helperText={errorMessages(shift_type_id?.message)}
              />

              <BankShiftSchemaAutocomplete
                name="bank_shift_type_id"
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                companyId={companyId}
                required
                error={!!bank_shift_type_id}
                helperText={errorMessages(bank_shift_type_id?.message)}
              />

              <WeeklyOffSchemeAutocomplete
                name="weekly_off_type_id"
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                companyId={companyId}
                required
                error={!!weekly_off_type_id}
                helperText={errorMessages(weekly_off_type_id?.message)}
              />

              <HolidaySchemeAutocomplete
                name="holiday_group_id"
                disabled={companyId ? false : true}
                control={control}
                loading={loading}
                companyId={companyId}
                required
                error={!!holiday_group_id}
                helperText={errorMessages(holiday_group_id?.message)}
              />

              <AttendancePenaltyRuleAutocomplete
                name="attendance_penalty_rule_id"
                control={control}
                disabled={companyId ? false : true}
                companyId={companyId}
                loading={loading}
              />

              <OvertimeRuleAutocomplete
                name="overtime_rule_id"
                control={control}
                disabled={companyId ? false : true}
                companyId={companyId}
                loading={loading}
              />

              <LeavePlanAutocomplete
                name="leave_plan_id"
                control={control}
                disabled={companyId ? false : true}
                companyId={companyId}
                loading={loading}
                required
                error={!!leave_plan_id}
                helperText={errorMessages(leave_plan_id?.message)}
              />
            </FormGridLayout>
          </FormSection>

          <Stack direction="row" justifyContent="space-between">
            <FormSection title="Employee Documents"></FormSection>

            <Button
              variant="outlined"
              sx={{ height: "50%" }}
              disabled={isPending || loading}
              startIcon={<Add />}
              onClick={() => onDialogOpen("addDocument")}
            >
              Add Document
            </Button>
          </Stack>
        </FormContainer>

        {!isEmpty(documentList) && (
          <DocumentList setFieldValue={setFieldValue} />
        )}

        <FormSection>
          <Stack direction="row" justifyContent="end">
            <Stack gap="10px" direction="row">
              <Stack direction="row" gap="5px">
                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("cancel")}
                  disabled={isPending || loading}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    setFieldValue("submitType", "draft");

                    handleSubmit(submitAsDraft)();
                  }}
                  disabled={loading || isPending}
                >
                  Save As Draft
                </Button>

                <Button
                  onClick={() => {
                    setFieldValue("submitType", "save");

                    handleSubmit(onSubmit)();
                  }}
                  disabled={loading}
                  loading={isPending}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </FormSection>

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

EmployeeForm.displayName = "EmployeeForm";
