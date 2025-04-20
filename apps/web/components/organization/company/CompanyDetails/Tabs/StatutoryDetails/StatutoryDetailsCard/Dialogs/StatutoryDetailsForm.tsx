import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../../utils/helper";
import {
  cinNoRegex,
  esiNoRegex,
  gstNoRegex,
  panCardRegex,
  ptNoRegex,
  tanNoRegex,
} from "../../../../../../../../utils/regex";

const StatutoryDetailsSchema = z.object({
  cin_no: z.string().regex(cinNoRegex, "common.cin_no.invalid").nullable(),
  registered_date: z.string().nullable(),
  pan_no: z
    .string()
    .regex(panCardRegex, "document.pan_card_no.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  tan_no: z.string().regex(tanNoRegex, "common.tan_no.invalid").nullable(),
  pf_no: z.string().nullable(),
  esi_no: z.string().regex(esiNoRegex, "common.esi_no.invalid").nullable(),
  gst_no: z.string().regex(gstNoRegex, "common.gst_no.invalid").nullable(),
  pt_no: z.string().regex(ptNoRegex, "common.pt_no.invalid").nullable(),
  license_no: z.string().nullable(),
  lwf_est_code: z.string().nullable(),
});

export type StatutoryDetailsFormFieldValues = z.infer<
  typeof StatutoryDetailsSchema
>;

type StatutoryDetailsFormProps = {
  defaultValues?: StatutoryDetailsFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<StatutoryDetailsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<StatutoryDetailsFormFieldValues>;
};

const formDefaultValues: StatutoryDetailsFormFieldValues = {
  cin_no: null,
  registered_date: null,
  pan_no: null,
  tan_no: null,
  pf_no: null,
  esi_no: null,
  gst_no: null,
  pt_no: null,
  license_no: null,
  lwf_est_code: null,
};

export const StatutoryDetailsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: StatutoryDetailsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(StatutoryDetailsSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="16px">
        <FormRow>
          <TextField
            name="cin_no"
            control={control}
            loading={loading}
            label="Registered No (CIN)"
            isCapitalize
            error={!!errors.cin_no}
            helperText={errorMessages(errors.cin_no?.message)}
          />

          <DatePicker
            setError={setError}
            name="registered_date"
            control={control}
            loading={loading}
            label="Registered Date"
            maxDate={DateTime.now()}
            error={!!errors.registered_date}
            helperText={errorMessages(errors.registered_date?.message)}
          />

          <TextField
            name="pan_no"
            control={control}
            loading={loading}
            label="PAN No"
            required
            isCapitalize
            error={!!errors.pan_no}
            helperText={errorMessages(errors.pan_no?.message)}
          />
        </FormRow>

        <FormRow>
          <TextField
            name="tan_no"
            loading={loading}
            control={control}
            isCapitalize
            label="TAN No"
            error={!!errors.tan_no}
            helperText={errorMessages(errors.tan_no?.message)}
          />

          <TextField
            name="pf_no"
            loading={loading}
            control={control}
            label="PF No"
            isCapitalize
          />

          <TextField
            name="esi_no"
            loading={loading}
            control={control}
            isCapitalize
            label="ESI No"
            error={!!errors.esi_no}
            helperText={errorMessages(errors.esi_no?.message)}
          />
        </FormRow>

        <FormRow>
          <TextField
            name="gst_no"
            loading={loading}
            control={control}
            isCapitalize
            label="GST No"
            error={!!errors.gst_no}
            helperText={errorMessages(errors.gst_no?.message)}
          />

          <TextField
            name="pt_no"
            loading={loading}
            control={control}
            isCapitalize
            label="PT No"
            error={!!errors.pt_no}
            helperText={errorMessages(errors.pt_no?.message)}
          />

          <TextField
            name="license_no"
            loading={loading}
            control={control}
            isCapitalize
            label="License No"
          />
        </FormRow>

        <FormRow>
          <TextField
            name="lwf_est_code"
            loading={loading}
            control={control}
            isCapitalize
            label="LWF EST. Code"
          />
        </FormRow>
      </Stack>
    );
  }
);

StatutoryDetailsForm.displayName = "StatutoryDetailsForm";
