import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  RadioGroupField,
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
import { useEnableDisableButton } from "../../../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../../../utils/helper";
import { BloodGroupAutocomplete } from "../../../../../../../../common/Autocomplete/BloodGroupAutocomplete";
import { CastAutocomplete } from "../../../../../../../../common/Autocomplete/CastAutocomplete";
import { MaritalStatusAutocomplete } from "../../../../../../../../common/Autocomplete/MaritalStatusAutocomplete";
import { NationalityAutocomplete } from "../../../../../../../../common/Autocomplete/NationalityAutocomplete";
import { ReligionAutocomplete } from "../../../../../../../../common/Autocomplete/ReligionAutocomplete";
import { SubCasteAutocomplete } from "../../../../../../../../common/Autocomplete/SubCastAutocomplete";

const PersonalInfoSchema = z.object({
  place_of_birth: z.string().max(255, "common.maxLength").nullable(),
  blood_group: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  marital_status: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  marriage_date: z.string().nullable(),
  nationality: z.string().nullable(),
  religion: z.string().nullable(),
  father_name: z.string().max(255, "common.maxLength").nullable(),
  spouse_name: z.string().max(255, "common.maxLength").nullable(),
  is_physically_challenged: z.boolean().nullable(),
  identity_mark: z.string().max(255, "common.maxLength").nullable(),
  caste: z.string().nullable(),
  sub_caste_id: z.string().nullable(),
  sub_caste_name: z.string().nullable(),
});

export type PersonalInfoFormFieldValues = z.infer<typeof PersonalInfoSchema>;

type PersonalInformationProps = {
  defaultValues?: PersonalInfoFormFieldValues;
  employeeId: string;
  loading: boolean;
};
export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<PersonalInfoFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<PersonalInfoFormFieldValues>;
};

const formDefaultValues: PersonalInfoFormFieldValues = {
  place_of_birth: null,
  blood_group: null,
  marital_status: null,
  marriage_date: null,
  nationality: null,
  religion: null,
  father_name: null,
  spouse_name: null,
  is_physically_challenged: false,
  identity_mark: null,
  caste: null,
  sub_caste_id: null,
  sub_caste_name: null,
};

export const PersonalInformationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      employeeId,
      loading,
    }: PersonalInformationProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      watch,
      control,
      setError,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(PersonalInfoSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            is_physically_challenged: true,
          });

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const castValue = watch("caste") ?? "";

    useMemo(() => {
      setValue("sub_caste_id", null, {
        shouldDirty: true,
      });
    }, [castValue]);

    return (
      <FormContainer>
        <FormSection>
          <FormRow>
            <TextField
              control={control}
              label="Place Of Birth"
              name="place_of_birth"
              loading={loading}
            />
            <BloodGroupAutocomplete
              name="blood_group"
              control={control}
              required
              error={!!errors.blood_group}
              helperText={errorMessages(errors.blood_group?.message)}
              loading={loading}
            />
            <MaritalStatusAutocomplete
              name="marital_status"
              control={control}
              required
              error={!!errors.marital_status}
              helperText={errorMessages(errors.marital_status?.message)}
              loading={loading}
            />
          </FormRow>
          <FormRow>
            <DatePicker
              name="marriage_date"
              setError={setError}
              control={control}
              label="Marriage Date"
              loading={loading}
              maxDate={DateTime.now()}
              error={!!errors.marriage_date}
              helperText={errorMessages(errors.marriage_date?.message)}
            />
            <NationalityAutocomplete
              name="nationality"
              control={control}
              loading={loading}
            />
            <ReligionAutocomplete
              name="religion"
              control={control}
              loading={loading}
            />
          </FormRow>
          <FormRow>
            <TextField
              name="father_name"
              control={control}
              label="Father Name"
              loading={loading}
            />
            <TextField
              name="spouse_name"
              control={control}
              label="Spouse Name"
              loading={loading}
            />
            <RadioGroupField
              loading={loading}
              name="is_physically_challenged"
              label="Physically Challenged"
              control={control}
              options={[
                {
                  values: true,
                  label: "Yes",
                  disabled: false,
                },
                {
                  values: false,
                  label: "No",
                  disabled: false,
                },
              ]}
            />
          </FormRow>
          <FormRow>
            <TextField
              name="identity_mark"
              control={control}
              label="Identity Mark"
              loading={loading}
            />
            <CastAutocomplete
              name="caste"
              control={control}
              loading={loading}
            />
            <SubCasteAutocomplete
              name="sub_caste_id"
              control={control}
              employeeId={employeeId}
              castValue={castValue}
              loading={loading}
              disabled={!castValue}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

PersonalInformationForm.displayName = " PersonalInformationForm";
