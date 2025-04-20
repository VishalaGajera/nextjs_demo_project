import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { esiNoRegex } from "../../../../../../utils/regex";
import { CompanyAutocomplete } from "../../../../../common/Autocomplete/CompanyAutocomplete";
import type {
  AutoShiftFormFieldValues,
  ShiftFormProps,
} from "../AutoShift/AutoShiftForm/AutoShiftForm";

export const basicDetailSchema = z.object({
  company_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  shift_type_code: z
    .string()
    .regex(esiNoRegex, "common.noSpecialChar")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  shift_type_name: z
    .string()
    .max(50, "common.maxLength.fifty")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(250, "common.maxLength").nullable().optional(),
});

export const BasicDetailFrom = ({
  loading,
  disabled = false,
  isEdit = false,
}: ShiftFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext<AutoShiftFormFieldValues>();

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Stack gap="10px">
      <FormRow maxColumn={2}>
        <CompanyAutocomplete
          control={control}
          loading={loading}
          name="company_id"
          error={!!errors.company_id}
          helperText={errorMessages(errors.company_id?.message)}
          required
          disabled={disabled || isEdit}
        />

        <TextField
          control={control}
          loading={loading}
          name="shift_type_code"
          label="Shift Code"
          required
          error={!!errors.shift_type_code}
          helperText={errorMessages(errors.shift_type_code?.message)}
          disabled={disabled || isEdit}
        />

        <TextField
          control={control}
          loading={loading}
          name="shift_type_name"
          label="Shift Name"
          required
          error={!!errors.shift_type_name}
          helperText={errorMessages(errors.shift_type_name?.message)}
          disabled={disabled}
        />
      </FormRow>

      <FormRow>
        <TextField
          control={control}
          loading={loading}
          disabled={disabled}
          name="description"
          label="Description"
        />
      </FormRow>
    </Stack>
  );
};
