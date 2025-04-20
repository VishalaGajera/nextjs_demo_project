import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  resetDependentFields,
} from "../../../../../../../../utils/helper";
import { percentageRegex } from "../../../../../../../../utils/regex";
import { QualificationAutocomplete } from "../../../../../../../common/Autocomplete/QualificationAutocomplete";
import type { PayloadEducation } from "./hooks/useAddEducation";

const EducationFormSchema = z.object({
  qualification: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  institute: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  from_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  to_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  percentage_or_grade: z
    .string()
    .regex(percentageRegex, "common.percentage.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  qualification_area: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type EducationFormFieldValues = z.infer<typeof EducationFormSchema>;

type EducationFormProps = {
  defaultValues?: EducationFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<EducationFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<EducationFormFieldValues>;
};

const formDefaultValues: EducationFormFieldValues = {
  qualification: null,
  institute: null,
  from_date: null,
  to_date: null,
  percentage_or_grade: null,
  qualification_area: null,
};

export const EducationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: EducationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      setError,
      watch,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(EducationFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const fromDate = watch("from_date");

    const dependentFieldsMap: Partial<
      Record<keyof EducationFormFieldValues, (keyof EducationFormFieldValues)[]>
    > = {
      from_date: ["to_date"],
    };

    useMemo(() => {
      resetDependentFields({
        fieldName: "from_date",
        fieldValue: fromDate,
        dirtyFields,
        setValue,
        dependentFieldsMap,
      });
    }, [fromDate]);

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          const payloadData: PayloadEducation = {
            qualification: filterFormValues.qualification,
            institute: filterFormValues.institute,
            from_date: filterFormValues.from_date,
            to_date: filterFormValues.to_date,
            percentage_or_grade: filterFormValues.percentage_or_grade,
            qualification_area: filterFormValues.qualification_area,
          };

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={2}>
            <QualificationAutocomplete
              name="qualification"
              control={control}
              loading={loading}
              required
              error={!!errors.qualification}
              helperText={errorMessages(errors.qualification?.message)}
              disabled={!!defaultValues.qualification || disabled}
            />
            <TextField
              control={control}
              label="Institute"
              name="institute"
              loading={loading}
              required
              error={!!errors.institute}
              helperText={errorMessages(errors.institute?.message)}
              disabled={disabled}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <DatePicker
              setError={setError}
              name="from_date"
              control={control}
              label="From Date"
              loading={loading}
              required
              maxDate={DateTime.now()}
              error={!!errors.from_date}
              helperText={errorMessages(errors.from_date?.message)}
              disabled={disabled}
            />

            <DatePicker
              setError={setError}
              name="to_date"
              control={control}
              label="To Date"
              loading={loading}
              required
              minDate={fromDate ? DateTime.fromISO(fromDate) : undefined}
              error={!!errors.to_date}
              helperText={errorMessages(errors.to_date?.message)}
              disabled={!fromDate || disabled}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <TextField
              control={control}
              label="CGPA/Percentage"
              name="percentage_or_grade"
              loading={loading}
              required
              error={!!errors.percentage_or_grade}
              helperText={errorMessages(errors.percentage_or_grade?.message)}
              disabled={disabled}
            />
            <TextField
              control={control}
              label="Qualification Area"
              name="qualification_area"
              loading={loading}
              required
              error={!!errors.qualification_area}
              helperText={errorMessages(errors.qualification_area?.message)}
              disabled={disabled}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

EducationForm.displayName = "EducationForm";
