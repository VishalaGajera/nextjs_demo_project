import {
  CheckBox,
  FormGridLayout,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { find } from "lodash";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { Debounce_Delay } from "../../../../../../../../../utils/helper";
import { useGetSalaryStructureNameOptions } from "../../../../../../../../common/Autocomplete/EmployeeFinance/Hooks/useGetSalaryStructureNameOptions";
import { useGetSalaryStructureOptions } from "../../../../../../../../common/Autocomplete/EmployeeFinance/Hooks/useGetSalaryStructureOptions";
import { SalaryStructureNameAutoComplete } from "../../../../../../../../common/Autocomplete/EmployeeFinance/SalaryStructureNameAutoComplete";
import { SalaryStructureOptionsAutoComplete } from "../../../../../../../../common/Autocomplete/EmployeeFinance/SalaryStructureOptionsAutoComplete";
import { getDynamicOptions } from "../../../../../../../../common/Autocomplete/EmployeeFinance/utils/getDynamicOptions";
import { StatutoryInfoFormSchema } from "../../../../../../../../EmployeeManagement/Employee/AddEmployee/EmployeeForm/StatutoryInfoForm";
import { useGetStatutoryInfo } from "../../../../../../../../EmployeeManagement/Employee/EmployeeDetails/Tabs/BankAndStatutory/StatutoryCard/Dialog/hooks/useGetStatutoryInfo";
import { useGetEmployeeFinanceList } from "../../../../../../EmployeeFinanceList/Hooks/useGetEmployeeFinanceList";
import { CalculationTypeFields } from "./CalculationTypeFields";
import { type AddSalarySetupApiPayload } from "./Hooks/useAddSalarySetup";
import { useGetCalculationTypeRadioOptions } from "./Hooks/useGetCalculationTypeRadioOptions";
import { useGetSalaryCustomDetails } from "./Hooks/useGetSalaryCustomDetails";
import {
  type SalaryRangeDetails,
  useGetSalaryRangesDetails,
} from "./Hooks/useGetSalaryRangesDetails";
import { SalaryComponentTable } from "./SalaryComponentTable";
import { StatutoryDetails } from "./StatutoryDetails";
import { calculateSalaryBifurcation } from "./utils/calculateSalaryBifurcation";
import {
  addSalarySetup,
  applySuperRefine,
  calculateTotal,
  getEmployee,
  getRangeId,
  initialSalaryStructureOptions,
  SalarySetupInitialValues,
} from "./utils/helper";

export const SalarySetupSchema = z
  .object({
    is_enable_payroll: z.boolean(),
    structure_by: z
      .enum(["monthly", "daily", "hourly", "annually"])
      .nullable()
      .optional(),
    structure_type: z.enum(["custom", "ranges"]).nullable().optional(),
    custom_structure_name: z.string().nullable().optional(),
    salary_setup: z.object({
      salary_calculation_type: z.enum([
        "monthly",
        "daily",
        "hourly",
        "fixed",
        "others",
      ]),
      effective_from: z.string().nullable(),
      salary: z
        .number()
        .int({
          message: "common.invalidNumber",
        })
        .nullable(),
      pay_schedule_group_id: z.string().nullable(),
      hourly_calculation_type: z
        .enum(["pay_schedule_wise", "employee_wise", "shift_wise"])
        .optional(),
      target_hours: z
        .number()
        .int({
          message: "common.invalidNumber",
        })
        .nullable()
        .optional(),
    }),
    salary_details: z.object({
      calculation_salary: z
        .number()
        .int({
          message: "common.invalidNumber",
        })
        .nullable(),
      salary_structure_id: z.string(),
      salary_structure_custom_id: z.string(),
      salary_structure_range_id: z.string(),
      salary_component_allocations: z.array(
        z.object({
          salary_structure_component_allocation_id: z.string().nullable(),
          salary_component_value: z.number().nullable(),
          salary_component_name: z
            .string()
            .refine((value) => !!value, {
              message: "common.required",
            })
            .nullable()
            .optional(),
        })
      ),
    }),
    statutory_details: StatutoryInfoFormSchema,
  })
  .superRefine((value, ctx) => {
    if (!value.is_enable_payroll) {
      return;
    }

    applySuperRefine({
      ctx,
      value,
    });
  });

export type SalarySetupSchemaType = z.infer<typeof SalarySetupSchema>;

type AddSalarySetupFormProps = {
  defaultValues?: SalarySetupSchemaType;
  employeeId: string;
};

export type AddSalarySetupFormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<AddSalarySetupApiPayload>) => void
  ) => void;
  setError: UseFormSetError<SalarySetupSchemaType>;
};

export const AddSalarySetupForm = forwardRef(
  (
    {
      defaultValues = SalarySetupInitialValues,
      employeeId,
    }: AddSalarySetupFormProps,
    ref: ForwardedRef<AddSalarySetupFormRef>
  ) => {
    const theme = useTheme();

    const { slate, mirage, butterflyBlue } = theme.palette.app.color;

    const [savedComponents, setSavedComponents] = useState<
      SalaryRangeDetails[]
    >([]);

    const [savedRangeId, setSavedRangeId] = useState<string>("");

    const {
      data: { employeeFinances },
    } = useGetEmployeeFinanceList();

    const employee = getEmployee({
      employeeFinances,
      employeeId,
    });

    const { data: options, isFetching } = useGetSalaryStructureNameOptions({
      companyId: employee.company_id,
    });

    const { data: statutoryDetails } = useGetStatutoryInfo({ employeeId });

    const {
      control,
      formState: { errors, dirtyFields },
      watch,
      setValue,
      resetField,
      handleSubmit,
      setError,
      clearErrors,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(SalarySetupSchema),
      mode: "all",
    });

    useEffect(() => {
      if (statutoryDetails) {
        setValue(
          "statutory_details",
          { ...statutoryDetails },
          {
            shouldDirty: false,
          }
        );
      }
    }, [statutoryDetails]);

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !!Object.keys(dirtyFields).length,
      buttonId: submitButtonId,
    });

    const defaultSelected = find(options, { label: "Default" }) ?? {
      label: "",
      value: "",
    };

    useMemo(() => {
      if (defaultSelected?.value && options?.length) {
        setValue("salary_details.salary_structure_id", defaultSelected.value);
      }
    }, [defaultSelected]);

    const ssId = watch("salary_details.salary_structure_id");

    const salaryStructureCustomId = watch(
      "salary_details.salary_structure_custom_id"
    );

    useMemo(() => {
      if (defaultSelected.value === ssId) {
        resetField("structure_by", {
          defaultValue: "monthly",
        });

        resetField("structure_type", {
          defaultValue: "custom",
        });

        resetField("custom_structure_name", {
          defaultValue: salaryStructureCustomId,
        });
      }
    }, [ssId]);

    const structureBy = watch("structure_by");

    const structureType = watch("structure_type");

    const calculationSalary = watch("salary_details.calculation_salary");

    const isPfApplicable = watch("statutory_details.pf_applicable");

    const isEsicApplicable = watch("statutory_details.esic_applicable");

    const isTdsApplicable = watch("statutory_details.tds_applicable");

    const salaryCalculationType = watch("salary_setup.salary_calculation_type");

    const isEnablePayroll = watch("is_enable_payroll");

    const hourlyCalculationType = watch("salary_setup.hourly_calculation_type");

    const salaryComponentAllocation = watch(
      "salary_details.salary_component_allocations"
    );

    useMemo(() => {
      if (!isPfApplicable || !isEnablePayroll) {
        clearErrors([
          "statutory_details.epf_group_id",
          "statutory_details.uan_no",
          "statutory_details.pf_joining_date",
          "statutory_details.pf_account_no",
        ]);

        resetField("statutory_details.epf_group_id", {
          defaultValue: "",
        });
      }

      if (!isEsicApplicable || !isEnablePayroll) {
        clearErrors([
          "statutory_details.esic_group_id",
          "statutory_details.esic_no",
          "statutory_details.esic_joining_date",
        ]);
      }

      if (!isTdsApplicable || !isEnablePayroll) {
        clearErrors(["statutory_details.tax_regime_id"]);
      }

      if (!isEnablePayroll) {
        resetField("statutory_details", {
          keepDirty: false,
        });
      }
    }, [isPfApplicable, isEsicApplicable, isTdsApplicable, isEnablePayroll]);

    useMemo(() => {
      const shouldClearFields = hourlyCalculationType ?? salaryCalculationType;

      if (shouldClearFields) {
        clearErrors([
          "salary_setup.effective_from",
          "salary_setup.salary_calculation_type",
          "salary_setup.target_hours",
          "salary_setup.pay_schedule_group_id",
          "salary_setup.salary",
          "salary_setup.hourly_calculation_type",
        ]);

        resetField("salary_setup.effective_from", {
          keepDirty: false,
        });

        resetField("salary_setup.target_hours", {
          keepDirty: false,
        });

        resetField("salary_setup.pay_schedule_group_id", {
          keepDirty: false,
        });

        resetField("salary_setup.salary", {
          keepDirty: false,
        });
      }
    }, [salaryCalculationType, isEnablePayroll, hourlyCalculationType]);

    const { data } = useGetSalaryStructureOptions({
      ssId,
    });

    const salaryStructureOptions = data ?? initialSalaryStructureOptions;

    useEffect(() => {
      const customStructureId =
        salaryStructureOptions?.options.value.monthly?.custom?.[0]?.value;

      if (customStructureId) {
        setValue(
          "salary_details.salary_structure_custom_id",
          customStructureId,
          {
            shouldDirty: structureType === "custom",
          }
        );
      }
    }, [salaryStructureOptions, ssId]);

    const salaryRangesOptions = getDynamicOptions({
      optionType: "structure_name",
      salaryStructureDataItem: salaryStructureOptions,
      structure_by: structureBy ?? "monthly",
      structure_type: structureType ?? "custom",
    });

    const [debounceCalculationSalary] = useDebounceValue(
      calculationSalary ?? 0,
      Debounce_Delay
    );

    const salaryRangesId = useMemo(() => {
      return getRangeId({
        salaryRangesOptions,
        salary: debounceCalculationSalary ?? 0,
        structureType: structureType ?? "custom",
      });
    }, [structureType, debounceCalculationSalary, structureBy, ssId]);

    const { value: salaryRangeId } = salaryRangesId ?? {};

    const {
      data: salaryRangeDetails,
      isFetching: isRangesFetching,
      refetch: refetchSalaryRanges,
    } = useGetSalaryRangesDetails({
      ssId,
      rangeId: salaryRangeId ?? "",
      interval: structureBy ?? "monthly",
    });

    const {
      data: salaryCustomDetails,
      isFetching: isCustomFetching,
      refetch: refetchCustomDetails,
    } = useGetSalaryCustomDetails({
      ssId,
      salaryStructureCustomId,
    });

    useEffect(() => {
      if (structureType === "ranges") {
        refetchSalaryRanges();
      } else {
        refetchCustomDetails();
      }
    }, [
      debounceCalculationSalary,
      structureBy,
      ssId,
      structureType,
      salaryRangeDetails,
      salaryCustomDetails,
    ]);

    const salaryRanges = salaryRangeDetails?.data?.length
      ? salaryRangeDetails.data
      : savedComponents;

    const customDetails =
      salaryCustomDetails?.data.salary_component_allocations ?? [];

    const isOnlyOneAdjustmentSelected = useMemo(() => {
      if (structureType === "ranges") {
        return salaryRanges.find(
          (salaryRange) => salaryRange.calculation_type === "adjustment"
        );
      }

      return customDetails.find(
        (customDetail) => customDetail.calculation_type === "adjustment"
      );
    }, [salaryRanges, customDetails, calculationSalary, structureType]);

    useMemo(() => {
      const salaryComponentAllocations = calculateSalaryBifurcation({
        salary: calculationSalary ?? 0,
        salaryComponents:
          structureType === "custom" ? customDetails : salaryRanges,
        isOnlyOneAdjustmentSelected: !!isOnlyOneAdjustmentSelected,
      });

      if (structureType === "custom" && customDetails) {
        setValue(
          "salary_details.salary_component_allocations",
          salaryComponentAllocations,
          {
            shouldDirty: true,
          }
        );
      }

      if (structureType === "ranges" && salaryRanges) {
        if (salaryRanges && savedComponents.length === 0 && salaryRangeId) {
          setSavedComponents(salaryRanges);
          setSavedRangeId(salaryRangeId);
        }

        setValue(
          "salary_details.salary_component_allocations",
          salaryComponentAllocations,
          {
            shouldDirty: true,
          }
        );

        if (salaryRangeId) {
          setValue(
            "salary_details.salary_structure_range_id",
            salaryRangeId ?? savedRangeId,
            {
              shouldDirty: structureType === "ranges",
            }
          );
        }
      }
    }, [
      structureType,
      calculationSalary,
      salaryCustomDetails,
      salaryRangeDetails,
      structureBy,
      ssId,
    ]);

    const dynamicTableHeaders = useMemo(() => {
      if (structureBy) {
        return ["monthly", "annually"].includes(structureBy ?? "monthly")
          ? ["Monthly", "Annually"]
          : [structureBy];
      }

      return [];
    }, [structureBy]);

    const totalValues: {
      monthly: number;
      annually: number;
      other: number;
    } = useMemo(() => {
      const isValidCalculation = !(
        calculationSalary && salaryComponentAllocation?.length
      );

      if (isValidCalculation) {
        return { monthly: 0, annually: 0, other: 0 };
      }

      return calculateTotal({
        allocations: salaryComponentAllocation,
        structureBy,
      });
    }, [
      calculationSalary,
      JSON.stringify(salaryComponentAllocation),
      structureBy,
      structureType,
    ]);

    useEffect(() => {
      if (defaultSelected?.value !== ssId) {
        resetField("structure_by", {
          defaultValue: null,
        });

        resetField("structure_type", {
          defaultValue: null,
        });

        resetField("custom_structure_name", {
          defaultValue: null,
        });

        resetField("salary_details.salary_structure_custom_id");

        resetField("salary_details.salary_structure_range_id");
      }
    }, [ssId]);

    useImperativeHandle(ref, () => {
      return {
        submitForm(onSubmit) {
          if (!isEnablePayroll) {
            clearErrors();
          }

          handleSubmit((formValues) => {
            const { payLoad } = addSalarySetup({
              dirtyFields,
              formValues,
            });

            onSubmit(payLoad);
          })();
        },
        setError,
      };
    });

    useEffect(() => {
      if (!isEnablePayroll) {
        clearErrors();
      }
    }, [isEnablePayroll]);

    const errorMessage = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const { structure_type, structure_by } = errors;

    const {
      calculation_salary,
      salary_structure_custom_id,
      salary_structure_id,
    } = errors.salary_details ?? {};

    const { calculationTypeRadioOptions } = useGetCalculationTypeRadioOptions();

    return (
      <Stack gap="24px">
        <Stack alignItems="center" flexDirection="row" gap="10px">
          <CheckBox name="is_enable_payroll" control={control} required />

          <Typography variant="body2" color={slate[900]} fontWeight={500}>
            Enable Payroll for this employee
          </Typography>
        </Stack>

        {isEnablePayroll && (
          <>
            <Box border={`1px solid ${butterflyBlue[300]}`} borderRadius="4px">
              <PadBox padding={{ padding: "24px 30px" }}>
                <Stack gap="24px">
                  <RadioGroupField
                    control={control}
                    name="salary_setup.salary_calculation_type"
                    options={calculationTypeRadioOptions}
                    label="Salary Calculation Type"
                  />

                  <CalculationTypeFields
                    control={control}
                    errors={errors}
                    employeeJoiningDate={employee.joining_date}
                    companyId={employee.company_id}
                    calculationType={salaryCalculationType}
                    hourlyCalculationType={hourlyCalculationType}
                  />
                </Stack>
              </PadBox>
            </Box>

            <Box border={`1px solid ${butterflyBlue[300]}`} borderRadius="4px">
              <PadBox padding={{ padding: "24px 30px" }}>
                <Stack gap="24px">
                  <Typography variant="h6" color={mirage[900]} fontWeight={500}>
                    Salary Details
                  </Typography>

                  <FormGridLayout columns={5}>
                    <TextField
                      type="number"
                      control={control}
                      name="salary_details.calculation_salary"
                      label="Salary Amount"
                      helperText={errorMessage(calculation_salary?.message)}
                      error={!!calculation_salary}
                      placeholder="Enter Salary Amount"
                      required
                    />

                    <SalaryStructureNameAutoComplete
                      name="salary_details.salary_structure_id"
                      control={control}
                      options={options}
                      disableClearable
                      helperText={errorMessage(salary_structure_id?.message)}
                      error={!!salary_structure_id?.message}
                      fullWidth
                      required
                    />

                    <SalaryStructureOptionsAutoComplete
                      salaryStructureDataItem={salaryStructureOptions}
                      name="structure_by"
                      optionType="structure_by"
                      disableClearable
                      structure_by={watch("structure_by") ?? "monthly"}
                      control={control}
                      helperText={errorMessage(structure_by?.message)}
                      error={!!structure_by?.message}
                      label="Salary Structure By"
                      placeholder="Select Salary Structure By"
                      required
                    />

                    <SalaryStructureOptionsAutoComplete
                      name="structure_type"
                      optionType="structure_type"
                      salaryStructureDataItem={salaryStructureOptions}
                      structure_type={watch("structure_type") ?? "ranges"}
                      control={control}
                      disableClearable
                      structure_by={structureBy ?? "monthly"}
                      helperText={errorMessage(structure_type?.message)}
                      error={!!structure_type?.message}
                      label="Salary Structure Type"
                      placeholder="Select Salary Structure By"
                      required
                    />

                    {structureType === "custom" && (
                      <SalaryStructureOptionsAutoComplete
                        name="salary_details.salary_structure_custom_id"
                        optionType="structure_name"
                        salaryStructureDataItem={salaryStructureOptions}
                        control={control}
                        required
                        disableClearable
                        structure_by={structureBy ?? "monthly"}
                        helperText={errorMessage(
                          salary_structure_custom_id?.message
                        )}
                        error={!!salary_structure_custom_id}
                        structure_type={structureType ?? "custom"}
                        label="Custom Structure Name"
                        placeholder="Select Custom Structure Name"
                      />
                    )}
                  </FormGridLayout>
                </Stack>
              </PadBox>
            </Box>

            <SalaryComponentTable
              headers={dynamicTableHeaders}
              watch={watch}
              control={control}
              errors={errors}
              totalValues={totalValues}
              isLoading={
                (isRangesFetching ?? isCustomFetching ?? isFetching) &&
                !!calculationSalary &&
                !salaryRangeId
              }
              isVisible={
                (!!calculationSalary &&
                  salaryComponentAllocation.length > 0 &&
                  !!structureBy) ||
                structureType === "custom"
              }
            />

            <StatutoryDetails watch={watch} errors={errors} control={control} />
          </>
        )}
      </Stack>
    );
  }
);

AddSalarySetupForm.displayName = "AddSalarySetupForm";
