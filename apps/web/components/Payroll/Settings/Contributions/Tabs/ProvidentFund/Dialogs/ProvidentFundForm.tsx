import {
  CheckBox,
  FormRow,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack, Typography } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  validateMaxDigit,
} from "../../../../../../../utils/helper";
import { holidayNameRegex } from "../../../../../../../utils/regex";
import { DurationAutocomplete } from "../../../../../../common/Autocomplete/DurationAutocomplete";

const validateContributionRate = (
  rateType: "percentage" | "fixed",
  percentageRate: number | null,
  fixedAmount: number | null,
  ctx: z.RefinementCtx,
  type: "employee" | "employer"
) => {
  if (rateType === "percentage") {
    if (percentageRate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [`${type}_contribution_rate`],
        message: "common.required",
      });
    } else if (Number(percentageRate) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [`${type}_contribution_rate`],
        message: "Must be greater than 0.",
      });
    }
  }

  if (rateType === "fixed") {
    if (fixedAmount === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [`${type}_fixed_contribution_amount`],
        message: "common.required",
      });
    } else if (Number(fixedAmount) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [`${type}_fixed_contribution_amount`],
        message: "Must be greater than 0.",
      });
    }

    validateMaxDigit(ctx, `${type}_fixed_contribution_amount`, fixedAmount);
  }
};

const ProvidentFundFormSchema = z
  .object({
    epf_group_name: z
      .string()
      .regex(holidayNameRegex, "common.noSpecialChar")
      .max(50, "common.maxLength.fifty")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    deduction_cycle_type: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    employee_contribution_rate_type: z.enum(["percentage", "fixed"]),
    employee_contribution_rate: z.number().max(100).nullable(),
    employee_fixed_contribution_amount: z.number().min(1).nullable(),
    employer_contribution_rate_type: z.enum(["percentage", "fixed"]),
    employer_contribution_rate: z.number().max(100).nullable(),
    employer_fixed_contribution_amount: z.number().min(1).nullable(),
    is_employee_override_rate: z.boolean(),
    is_vpf_contribution_allowed: z.boolean(),
    pf_interest_rate: z.number().min(0).max(100).nullable(),
    pension_eligibility_age: z.number().min(18).max(65).nullable(),
    edli_charge_min_amount: z.number().min(0).nullable(),
    edli_charge_rate: z.number().min(0).max(100).nullable(),
    admin_min_no_member_charge: z.number().min(0).nullable(),
    admin_min_charge_amount: z.number().min(0).nullable(),
    admin_charge_rate: z.number().min(0).max(100).nullable(),
    employer_sub_pf_contribution_rate: z.number().min(0).max(100).nullable(),
    employer_sub_eps_contribution_rate: z.number().min(0).max(100).nullable(),
  })
  .superRefine((values, ctx) => {
    validateContributionRate(
      values.employee_contribution_rate_type,
      values.employee_contribution_rate,
      values.employee_fixed_contribution_amount,
      ctx,
      "employee"
    );

    validateContributionRate(
      values.employer_contribution_rate_type,
      values.employer_contribution_rate,
      values.employer_fixed_contribution_amount,
      ctx,
      "employer"
    );

    if (values.pf_interest_rate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pf_interest_rate"],
        message: "common.required",
      });
    }

    if (values.admin_min_charge_amount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["admin_min_charge_amount"],
        message: "common.required",
      });
    }

    if (values.admin_charge_rate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["admin_charge_rate"],
        message: "common.required",
      });
    }

    if (values.employer_sub_pf_contribution_rate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["employer_sub_pf_contribution_rate"],
        message: "common.required",
      });
    }

    if (values.employer_sub_eps_contribution_rate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["employer_sub_eps_contribution_rate"],
        message: "common.required",
      });
    }

    const sumOfSubComponents =
      Number(values.employer_sub_pf_contribution_rate ?? 0) +
      Number(values.employer_sub_eps_contribution_rate ?? 0);

    if (values.employer_contribution_rate_type == "percentage") {
      if (sumOfSubComponents !== Number(values.employer_contribution_rate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["employer_sub_eps_contribution_rate"],
          message:
            "Sum of Sub Components Must be equal to employer contribution rate.",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["employer_sub_pf_contribution_rate"],
          message:
            "Sum of Sub Components Must be equal to employer contribution rate.",
        });
      }
    }

    if (values.employer_contribution_rate_type == "fixed") {
      if (sumOfSubComponents !== 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["employer_sub_eps_contribution_rate"],
          message: "Sum of Sub Components Must be 12%.",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["employer_sub_pf_contribution_rate"],
          message: "Sum of Sub Components Must be 12%.",
        });
      }
    }

    validateMaxDigit(
      ctx,
      "admin_min_no_member_charge",
      values.admin_min_no_member_charge
    );

    validateMaxDigit(
      ctx,
      "admin_min_charge_amount",
      values.admin_min_charge_amount
    );

    validateMaxDigit(
      ctx,
      "edli_charge_min_amount",
      values.edli_charge_min_amount
    );
  });

export type ProvidentFundFormFieldValues = z.infer<
  typeof ProvidentFundFormSchema
>;

type ProvidentFundFormProps = {
  defaultValues?: ProvidentFundFormFieldValues;
  loading?: boolean;
  dialogType?: "add" | "edit" | "view";
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<ProvidentFundFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<ProvidentFundFormFieldValues>;
};

const formDefaultValues: ProvidentFundFormFieldValues = {
  epf_group_name: null,
  deduction_cycle_type: "monthly",
  employee_contribution_rate_type: "percentage",
  employee_contribution_rate: null,
  employee_fixed_contribution_amount: null,
  employer_contribution_rate_type: "percentage",
  employer_contribution_rate: null,
  employer_fixed_contribution_amount: null,
  is_employee_override_rate: false,
  is_vpf_contribution_allowed: false,
  pension_eligibility_age: null,
  pf_interest_rate: null,
  edli_charge_min_amount: null,
  edli_charge_rate: null,
  admin_min_no_member_charge: null,
  admin_min_charge_amount: null,
  admin_charge_rate: null,
  employer_sub_pf_contribution_rate: null,
  employer_sub_eps_contribution_rate: null,
};

export const ProvidentFundForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      dialogType = "add",
    }: ProvidentFundFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const isEdit = dialogType === "edit";

    const isView = dialogType === "view";

    const {
      control,
      setError,
      watch,
      setValue,
      clearErrors,
      resetField,
      trigger,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(ProvidentFundFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            employee_contribution_rate_type: isEdit
              ? dirtyFields.employee_contribution_rate_type
              : true,
            employer_contribution_rate_type: isEdit
              ? dirtyFields.employer_contribution_rate_type
              : true,
            employee_contribution_rate:
              formValues.employee_contribution_rate_type !== "percentage"
                ? false
                : dirtyFields.employee_contribution_rate,
            employee_fixed_contribution_amount:
              formValues.employee_contribution_rate_type !== "fixed"
                ? false
                : dirtyFields.employee_fixed_contribution_amount,
            employer_contribution_rate:
              formValues.employer_contribution_rate_type !== "percentage"
                ? false
                : dirtyFields.employer_contribution_rate,
            employer_fixed_contribution_amount:
              formValues.employer_contribution_rate_type !== "fixed"
                ? false
                : dirtyFields.employer_fixed_contribution_amount,
            is_employee_override_rate: isEdit
              ? dirtyFields.is_employee_override_rate
              : true,
            is_vpf_contribution_allowed: isEdit
              ? dirtyFields.is_vpf_contribution_allowed
              : true,
            deduction_cycle_type: isEdit
              ? dirtyFields.deduction_cycle_type
              : true,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const employeeContributionRateType = watch(
      "employee_contribution_rate_type"
    );

    const employerContributionRateType = watch(
      "employer_contribution_rate_type"
    );

    const employerContributionRate = watch("employer_contribution_rate");

    const employerFixedContributionAmount = watch(
      "employer_fixed_contribution_amount"
    );

    const employerSubPfContributionRate = watch(
      "employer_sub_pf_contribution_rate"
    );

    const employerSubEpsContributionRate = watch(
      "employer_sub_eps_contribution_rate"
    );

    useMemo(() => {
      if (
        employerContributionRate !== null ||
        employerFixedContributionAmount !== null
      ) {
        if (employerSubEpsContributionRate !== null) {
          trigger("employer_sub_eps_contribution_rate");
        }

        if (employerSubPfContributionRate !== null) {
          trigger("employer_sub_pf_contribution_rate");
        }
      }
    }, [
      employerSubPfContributionRate,
      employerSubEpsContributionRate,
      employerContributionRate,
      employerFixedContributionAmount,
    ]);

    useMemo(() => {
      if (employeeContributionRateType === "percentage") {
        setValue("employee_fixed_contribution_amount", null, {
          shouldDirty: false,
        });
        clearErrors("employee_fixed_contribution_amount");
      } else if (employeeContributionRateType === "fixed") {
        setValue("employee_contribution_rate", null, { shouldDirty: false });
        clearErrors("employee_contribution_rate");
      }

      if (employerContributionRateType === "percentage") {
        setValue("employer_fixed_contribution_amount", null, {
          shouldDirty: false,
        });
        clearErrors("employer_fixed_contribution_amount");
        resetField("employer_sub_pf_contribution_rate");
        resetField("employer_sub_eps_contribution_rate");
      } else if (employerContributionRateType === "fixed") {
        setValue("employer_contribution_rate", null, { shouldDirty: false });
        clearErrors("employer_contribution_rate");
        resetField("employer_sub_pf_contribution_rate");
        resetField("employer_sub_eps_contribution_rate");
      }
    }, [employeeContributionRateType, employerContributionRateType]);

    return (
      <Stack gap="30px">
        <FormRow maxColumn={3}>
          <TextField
            name="epf_group_name"
            control={control}
            label="PF Group Name"
            required
            error={!!errors.epf_group_name}
            helperText={errorMessages(errors.epf_group_name?.message)}
            disabled={isView}
            loading={loading}
          />

          <DurationAutocomplete
            control={control}
            required
            loading={loading}
            label="Deduction Cycle"
            error={!!errors.deduction_cycle_type}
            helperText={errorMessages(errors.deduction_cycle_type?.message)}
            name="deduction_cycle_type"
            disabled
          />
        </FormRow>

        <Stack gap="10px">
          <Typography variant="h6">
            Employee&apos;s PF Contribution Rate
          </Typography>

          <RadioGroupField
            name="employee_contribution_rate_type"
            control={control}
            loading={loading}
            direction="column"
            label=""
            sx={{
              alignItems: "flex-start",
            }}
            options={[
              {
                label: (
                  <Stack gap="10px" alignItems="baseline" direction="row">
                    <InputLabel>
                      Employee&apos;s PF will be calculated as
                    </InputLabel>

                    <TextField
                      sx={{ maxWidth: "250px" }}
                      type="number"
                      name="employee_contribution_rate"
                      placeholder="00"
                      control={control}
                      label=""
                      loading={loading}
                      disabled={
                        employeeContributionRateType != "percentage" ||
                        isEdit ||
                        isView
                      }
                      error={!!errors.employee_contribution_rate}
                      helperText={errorMessages(
                        errors.employee_contribution_rate?.message
                      )}
                    />

                    <InputLabel>
                      % of the amount exceeding the statutory minimum.
                    </InputLabel>
                  </Stack>
                ),
                values: "percentage",
                disabled: isEdit || isView,
              },
              {
                label: (
                  <Stack gap="10px" alignItems="baseline" direction="row">
                    <InputLabel>Employee&apos;s PF will be a fixed</InputLabel>

                    <TextField
                      sx={{ maxWidth: "250px" }}
                      type="number"
                      name="employee_fixed_contribution_amount"
                      control={control}
                      label=""
                      placeholder="00"
                      loading={loading}
                      disabled={
                        employeeContributionRateType != "fixed" ||
                        isEdit ||
                        isView
                      }
                      error={!!errors.employee_fixed_contribution_amount}
                      helperText={errorMessages(
                        errors.employee_fixed_contribution_amount?.message
                      )}
                    />

                    <InputLabel>
                      (amount), capped at the statutory minimum.
                    </InputLabel>
                  </Stack>
                ),
                values: "fixed",
                disabled: isEdit || isView,
              },
            ]}
          />
        </Stack>

        <Stack gap="10px">
          <Typography variant="h6">
            Employer&apos;s PF Contribution Rate
          </Typography>

          <RadioGroupField
            name="employer_contribution_rate_type"
            control={control}
            loading={loading}
            direction="column"
            label=""
            sx={{
              alignItems: "flex-start",
            }}
            options={[
              {
                label: (
                  <Stack gap="10px" alignItems="baseline" direction="row">
                    <InputLabel>
                      Employer&apos;s PF will be calculated as
                    </InputLabel>

                    <TextField
                      sx={{ maxWidth: "250px" }}
                      type="number"
                      name="employer_contribution_rate"
                      control={control}
                      label=""
                      placeholder="00"
                      loading={loading}
                      disabled={
                        employerContributionRateType != "percentage" ||
                        isEdit ||
                        isView
                      }
                      error={!!errors.employer_contribution_rate}
                      helperText={errorMessages(
                        errors.employer_contribution_rate?.message
                      )}
                    />

                    <InputLabel>
                      % of the amount exceeding the statutory minimum.
                    </InputLabel>
                  </Stack>
                ),
                values: "percentage",
                disabled: isEdit || isView,
              },
              {
                label: (
                  <Stack gap="10px" alignItems="baseline" direction="row">
                    <InputLabel>Employer&apos;s PF will be a fixed</InputLabel>

                    <TextField
                      sx={{ maxWidth: "250px" }}
                      type="number"
                      name="employer_fixed_contribution_amount"
                      control={control}
                      label=""
                      placeholder="00"
                      loading={loading}
                      disabled={
                        employerContributionRateType != "fixed" ||
                        isEdit ||
                        isView
                      }
                      error={!!errors.employer_fixed_contribution_amount}
                      helperText={errorMessages(
                        errors.employer_fixed_contribution_amount?.message
                      )}
                    />

                    <InputLabel>
                      (amount), capped at the statutory minimum.
                    </InputLabel>
                  </Stack>
                ),
                values: "fixed",
                disabled: isEdit || isView,
              },
            ]}
          />
        </Stack>

        <Stack gap="10px">
          <Typography variant="h6">
            Sub Components Of Employer&apos;s PF Contribution
          </Typography>

          <Stack gap="10px" alignItems="baseline">
            <Stack gap="10px" direction="row" alignItems="baseline">
              <InputLabel>Employer&apos;s Provident Fund (A/C no 1)</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="employer_sub_pf_contribution_rate"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.employer_sub_pf_contribution_rate}
                helperText={errorMessages(
                  errors.employer_sub_pf_contribution_rate?.message
                )}
                disabled={
                  isView ||
                  (!employerContributionRate &&
                    !employerFixedContributionAmount)
                }
              />

              <InputLabel>% of statutory wages</InputLabel>
            </Stack>

            <Stack gap="10px" direction="row" alignItems="baseline">
              <InputLabel>
                Employer&apos;s Pension Scheme (A/C no 10)
              </InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="employer_sub_eps_contribution_rate"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.employer_sub_eps_contribution_rate}
                helperText={errorMessages(
                  errors.employer_sub_eps_contribution_rate?.message
                )}
                disabled={
                  isView ||
                  (!employerContributionRate &&
                    !employerFixedContributionAmount)
                }
              />

              <InputLabel>% of statutory wages</InputLabel>
            </Stack>
          </Stack>
        </Stack>

        <Stack gap="30px">
          <Typography variant="h6">
            Other Charges (EPF Admin Charges & EDLI Charges)
          </Typography>

          <Stack gap="15px" alignItems="baseline">
            <Typography variant="subtitle1" fontWeight={500}>
              EPF Admin Charge Configuration
            </Typography>

            <Stack
              gap="10px"
              direction="row"
              alignItems="baseline"
              paddingLeft="20px"
            >
              <InputLabel>EPF Admin Charge (A/C no 2)</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="admin_charge_rate"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.admin_charge_rate}
                helperText={errorMessages(errors.admin_charge_rate?.message)}
                disabled={isView}
              />

              <InputLabel>%</InputLabel>
            </Stack>

            <Stack
              gap="10px"
              direction="row"
              alignItems="baseline"
              paddingLeft="20px"
            >
              <InputLabel>EPF Admin Minimum Charge Rs</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="admin_min_charge_amount"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.admin_min_charge_amount}
                helperText={errorMessages(
                  errors.admin_min_charge_amount?.message
                )}
                disabled={isView}
              />
            </Stack>

            <Stack
              gap="10px"
              direction="row"
              alignItems="baseline"
              paddingLeft="20px"
            >
              <InputLabel>
                EPF Admin Minimum Charge If No Contributory Member Rs
              </InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="admin_min_no_member_charge"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.admin_min_no_member_charge}
                helperText={errorMessages(
                  errors.admin_min_no_member_charge?.message
                )}
                disabled={isView}
              />
            </Stack>
          </Stack>

          <Stack gap="15px" alignItems="baseline">
            <Typography variant="subtitle1" fontWeight={500}>
              EDLI Charge Configuration
            </Typography>

            <Stack
              gap="10px"
              direction="row"
              alignItems="baseline"
              paddingLeft="20px"
            >
              <InputLabel>EDLI Charge (A/C no 21)</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="edli_charge_rate"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.edli_charge_rate}
                helperText={errorMessages(errors.edli_charge_rate?.message)}
                disabled={isView}
              />

              <InputLabel>%</InputLabel>
            </Stack>

            <Stack
              gap="10px"
              direction="row"
              alignItems="baseline"
              paddingLeft="20px"
            >
              <InputLabel>EDLI Minimum Charge Rs</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="edli_charge_min_amount"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.edli_charge_min_amount}
                helperText={errorMessages(
                  errors.edli_charge_min_amount?.message
                )}
                disabled={isView}
              />
            </Stack>
          </Stack>

          <Stack gap="20px">
            <Stack gap="10px" direction="row" alignItems="baseline">
              <InputLabel>Employee Pension Age</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="pension_eligibility_age"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.pension_eligibility_age}
                helperText={errorMessages(
                  errors.pension_eligibility_age?.message
                )}
                disabled={isView}
              />
            </Stack>

            <Stack gap="10px" direction="row" alignItems="baseline">
              <InputLabel>PF Interest Rate</InputLabel>

              <TextField
                sx={{ maxWidth: "250px" }}
                type="number"
                name="pf_interest_rate"
                placeholder="00"
                control={control}
                label=""
                loading={loading}
                error={!!errors.pf_interest_rate}
                helperText={errorMessages(errors.pf_interest_rate?.message)}
                disabled={isView}
              />

              <InputLabel>%</InputLabel>
            </Stack>

            <Stack alignItems="start" flexDirection="row" gap="10px">
              <CheckBox
                name="is_employee_override_rate"
                control={control}
                disabled={isView}
                loading={loading}
              />

              <Typography variant="body1">
                Override PF contribution rate at employee level
              </Typography>
            </Stack>

            <Stack alignItems="start" flexDirection="row" gap="10px">
              <CheckBox
                name="is_vpf_contribution_allowed"
                control={control}
                disabled={isView}
                loading={loading}
              />

              <Typography variant="body1">
                Allow employees to contribute towards VPF
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

ProvidentFundForm.displayName = "ProvidentFundForm";
