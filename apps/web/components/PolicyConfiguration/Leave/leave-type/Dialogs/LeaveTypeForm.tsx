import { CheckBox, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack } from "@mui/material";
import { isEmpty } from "lodash";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButtonToggle } from "../../../../../hooks/useEnableDisableButtonToggle";
import { filterChangedFormFields } from "../../../../../utils/helper";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { LeaveTypeAutocomplete } from "../../../../common/Autocomplete/LeaveTypeAutocomplete";
import { OtherSettings } from "./OtherSettings";
import type { PayloadLeaveType } from "./hooks/useAddLeaveType";

const LeaveTypeFormSchema = z
  .object({
    company_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    leave_type: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    leave_type_code: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    colour_code: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    leave_type_name: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().optional().nullable(),
    is_sick_leave: z.boolean().optional().nullable(),
    isApplicableToGender: z.boolean().optional().nullable(),
    applicable_to_gender: z.string().optional().nullable(),
    isApplicableToMaritalStatus: z.boolean().optional().nullable(),
    applicable_to_marital_status: z.string().optional().nullable(),
    isApplicableToLeaveReason: z.boolean().optional().nullable(),
    leave_reasons: z.array(z.string()).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.isApplicableToGender) {
      data.applicable_to_gender = null;
    } else if (data.isApplicableToGender && !data.applicable_to_gender) {
      ctx.addIssue({
        path: ["applicable_to_gender"],
        message: "common.required",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.isApplicableToMaritalStatus) {
      data.applicable_to_marital_status = null;
    } else if (
      data.isApplicableToMaritalStatus &&
      !data.applicable_to_marital_status
    ) {
      ctx.addIssue({
        path: ["applicable_to_marital_status"],
        message: "common.required",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.isApplicableToLeaveReason) {
      data.leave_reasons = null;
    } else if (
      data.isApplicableToLeaveReason &&
      (!data.leave_reasons || data.leave_reasons.length === 0)
    ) {
      ctx.addIssue({
        path: ["leave_reasons"],
        message: "common.required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export default LeaveTypeFormSchema;

export type LeaveTypeFormFieldValues = z.infer<typeof LeaveTypeFormSchema>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LeaveTypeFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LeaveTypeFormFieldValues>;
};

type BankShiftFormProps = {
  defaultValues?: LeaveTypeFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

const formDefaultValues: LeaveTypeFormFieldValues = {
  company_id: null,
  leave_type: null,
  leave_type_code: null,
  colour_code: null,
  leave_type_name: null,
  description: null,
  is_sick_leave: null,
  isApplicableToGender: null,
  isApplicableToMaritalStatus: null,
  isApplicableToLeaveReason: null,
  applicable_to_gender: null,
  applicable_to_marital_status: null,
  leave_reasons: null,
};

export const LeaveTypeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: BankShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(LeaveTypeFormSchema),
      mode: "all",
    });

    const {
      setError,
      control,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !isEmpty(dirtyFields),
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          const payloadData: PayloadLeaveType = {
            company_id: filterFormValues.company_id,
            leave_type: filterFormValues.leave_type,
            leave_type_code: filterFormValues.leave_type_code,
            leave_type_name: filterFormValues.leave_type_name,
            description: filterFormValues.description,
            is_sick_leave: filterFormValues.is_sick_leave,
            applicable_to_gender: filterFormValues.applicable_to_gender,
            applicable_to_marital_status:
              filterFormValues.applicable_to_marital_status,
            leave_reasons: filterFormValues.leave_reasons,
            colour_code: filterFormValues.colour_code,
          };

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

    return (
      <Stack gap="16px">
        <FormProvider {...methods}>
          <FormRow maxColumn={2}>
            <CompanyAutocomplete
              loading={loading}
              control={control}
              error={!!errors.company_id}
              helperText={errorMessages(errors.company_id?.message)}
              disabled={!!defaultValues.company_id || disabled}
              name="company_id"
              required
            />

            <LeaveTypeAutocomplete
              name="leave_type"
              loading={loading}
              control={control}
              required
              error={!!errors.leave_type}
              helperText={errorMessages(errors.leave_type?.message)}
              disabled={!!defaultValues.leave_type || disabled}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            <TextField
              label="Leave Code"
              name="leave_type_code"
              control={control}
              loading={loading}
              disabled={!!defaultValues.leave_type_code || disabled}
              required
              error={!!errors.leave_type_code}
              helperText={errorMessages(errors.leave_type_code?.message)}
            />

            <TextField
              label="Leave Name"
              name="leave_type_name"
              control={control}
              loading={loading}
              required
              error={!!errors.leave_type_name}
              helperText={errorMessages(errors.leave_type_name?.message)}
              disabled={disabled}
            />
          </FormRow>

          <FormRow maxColumn={2}>
            <TextField
              type="color"
              label="Leave Color"
              control={control}
              name="colour_code"
              loading={loading}
              required
              error={!!errors.colour_code}
              helperText={errorMessages(errors.colour_code?.message)}
              disabled={disabled}
            />
          </FormRow>

          <TextField
            label="Description"
            name="description"
            multiline
            control={control}
            fullWidth
            loading={loading}
            disabled={disabled}
          />

          <Stack gap="10px" paddingTop="10px">
            <Stack direction="row" gap="10px" alignItems="center">
              <CheckBox
                name="is_sick_leave"
                size="medium"
                control={control}
                disabled={!!defaultValues.company_id || disabled}
                loading={loading}
              />

              <InputLabel>is Leave Sick/Medical?</InputLabel>
            </Stack>

            <OtherSettings
              loading={loading}
              disabled={!!defaultValues.company_id || disabled}
            />
          </Stack>
        </FormProvider>
      </Stack>
    );
  }
);

LeaveTypeForm.displayName = "LeaveTypeForm";
