import { DatePicker, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../utils/helper";
import { BloodGroupAutocomplete } from "../../../../../../common/Autocomplete/BloodGroupAutocomplete";
import { GenderAutocomplete } from "../../../../../../common/Autocomplete/GenderAutoComplete";
import { NationalityAutocomplete } from "../../../../../../common/Autocomplete/NationalityAutocomplete";
import { EmergencyRelationAutocomplete } from "../../../../../../common/Autocomplete/RelationshipAutocomplete/EmergencyRelationAutocomplete";
import { BloodTypeSchema } from "../../../../../../common/Autocomplete/hooks/useGetBloodGroupOption";
import { GenderTypeSchema } from "../../../../../../common/Autocomplete/hooks/useGetGenderOptions";

const RelationshipSchema = z.enum([
  "brother",
  "daughter",
  "father",
  "mother",
  "husband",
  "sister",
  "son",
  "wife",
  "others",
]);

const NationalitySchema = z.enum(["indian", "others"]);

export const FamilyDetailsFormSchema = z
  .object({
    name: z
      .string()
      .max(255, "common.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    date_of_birth: z.string().optional().nullable(),
    gender: GenderTypeSchema.nullable().optional(),
    blood_group: BloodTypeSchema.optional().nullable(),
    relation: RelationshipSchema.nullable().optional(),
    profession: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    nationality: NationalitySchema.nullable().refine((value) => !!value, {
      message: "common.required",
    }),
    address: z.string().optional().nullable(),
  })
  .superRefine((val, ctx) => {
    if (!val.gender) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["gender"],
      });
    }

    if (!val.relation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["relation"],
      });
    }
  });

export type FamilyDetailsFormFieldValues = z.infer<
  typeof FamilyDetailsFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<FamilyDetailsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<FamilyDetailsFormFieldValues>;
};

type FamilyDetailsFormProps = {
  defaultValues?: FamilyDetailsFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

const formDefaultValues: FamilyDetailsFormFieldValues = {
  name: null,
  date_of_birth: null,
  gender: null,
  blood_group: null,
  relation: null,
  profession: null,
  address: null,
  nationality: "indian",
};

export const FamilyDetailsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: FamilyDetailsFormProps,
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
      resolver: zodResolver(FamilyDetailsFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            gender: true,
            relation: true,
            nationality: true,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="20px">
        <FormRow maxColumn={2}>
          <TextField
            control={control}
            label="Name"
            name="name"
            required
            error={!!errors.name}
            helperText={errorMessages(errors.name?.message)}
            loading={loading}
            disabled={disabled}
          />
          <EmergencyRelationAutocomplete
            control={control}
            name="relation"
            required
            error={!!errors.relation}
            helperText={errorMessages(errors.relation?.message)}
            loading={loading}
            disabled={disabled}
          />
        </FormRow>
        <FormRow maxColumn={2}>
          <DatePicker
            setError={setError}
            name="date_of_birth"
            control={control}
            label="Date of Birth"
            loading={loading}
            maxDate={DateTime.now()}
            error={!!errors.date_of_birth}
            helperText={errorMessages(errors.date_of_birth?.message)}
            disabled={disabled}
          />
          <TextField
            control={control}
            label="Profession"
            name="profession"
            required
            error={!!errors.profession}
            helperText={errorMessages(errors.profession?.message)}
            loading={loading}
            disabled={disabled}
          />
        </FormRow>
        <FormRow maxColumn={2}>
          <GenderAutocomplete
            control={control}
            name="gender"
            required
            error={!!errors.gender}
            helperText={errorMessages(errors.gender?.message)}
            loading={loading}
            disabled={disabled}
          />
          <NationalityAutocomplete
            control={control}
            name="nationality"
            required
            error={!!errors.nationality}
            helperText={errorMessages(errors.nationality?.message)}
            loading={loading}
            disabled={disabled}
          />
        </FormRow>
        <FormRow maxColumn={2}>
          <BloodGroupAutocomplete
            control={control}
            name="blood_group"
            loading={loading}
            disabled={disabled}
          />
          <TextField
            control={control}
            label="Address"
            name="address"
            loading={loading}
            disabled={disabled}
          />
        </FormRow>
      </Stack>
    );
  }
);

FamilyDetailsForm.displayName = "FamilyDetailsForm";
