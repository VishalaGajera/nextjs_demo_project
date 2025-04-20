import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  PhoneInputField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
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
import { isValidMobileNumber } from "../../../../../../../../utils/mobileNumberValidate";
import {
  emailRegex,
  phoneNumberRegex,
  pinCodeRegex,
} from "../../../../../../../../utils/regex";
import { CityAutocomplete } from "../../../../../../../common/Autocomplete/CityAutocomplete";
import { CountryAutocomplete } from "../../../../../../../common/Autocomplete/CountryAutocomplete";
import { IndustryAutocomplete } from "../../../../../../../common/Autocomplete/IndustryAutocomplete";
import { StateAutocomplete } from "../../../../../../../common/Autocomplete/StateAutocomplete";
import { ImageUploadField } from "../../../../../../../common/ImageUploadField";

const BasicDetailsFormSchema = z.object({
  about_company: z.string().max(255, "common.maxLength").nullable(),
  address: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  city_id: z.string().nullable().optional(),
  company_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  company_start_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  country_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  email: z
    .string()
    .max(255, "common.maxLength")
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  industry_id: z
    .string()
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
  phone_no: z
    .string()
    .regex(phoneNumberRegex, "common.phoneNumber.invalid")
    .nullable(),
  state_id: z.string().nullable().optional(),
  company_logo: z.string().nullable(),
  pin_code: z
    .string()
    .regex(pinCodeRegex, "common.pinCode.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  vision_and_mission: z.string().max(255, "common.maxLength").nullable(),
});

export type BasicDetailsFormFieldValues = z.infer<
  typeof BasicDetailsFormSchema
>;

type BasicDetailsFormProps = {
  defaultValues?: BasicDetailsFormFieldValues;
  companyId?: string;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BasicDetailsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<BasicDetailsFormFieldValues>;
};

const formDefaultValues: BasicDetailsFormFieldValues = {
  about_company: null,
  address: null,
  company_logo: null,
  company_name: null,
  company_start_date: null,
  country_id: null,
  email: null,
  industry_id: null,
  mobile_no: null,
  phone_no: null,
  pin_code: null,
  state_id: null,
  city_id: null,
  vision_and_mission: null,
};

export const BasicDetailsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: BasicDetailsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const updatedVariantValueSchema = BasicDetailsFormSchema.superRefine(
      (value, ctx) => {
        if (value?.country_id && !value?.state_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["state_id"],
          });
        }

        if (value?.state_id && !value?.city_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["city_id"],
          });
        }
      }
    );

    const {
      watch,
      control,
      setValue,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(updatedVariantValueSchema),
      mode: "all",
    });

    const countryId = watch("country_id");

    const stateId = watch("state_id") ?? "";

    useEnableDisableButton({ control, defaultValues, errors });

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

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const dependentFieldsMap: Partial<
      Record<
        keyof BasicDetailsFormFieldValues,
        (keyof BasicDetailsFormFieldValues)[]
      >
    > = {
      country_id: ["state_id", "city_id"],
      state_id: ["city_id"],
    };

    useMemo(() => {
      resetDependentFields({
        fieldName: "country_id",
        fieldValue: countryId,
        dirtyFields,
        setValue,
        dependentFieldsMap,
      });
    }, [countryId]);

    useMemo(() => {
      resetDependentFields({
        fieldName: "state_id",
        fieldValue: stateId,
        dirtyFields,
        setValue,
        dependentFieldsMap,
      });
    }, [stateId]);

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={1}>
            <ImageUploadField
              control={control}
              name="company_logo"
              label="Company Logo"
            />
          </FormRow>
          <FormRow>
            <TextField
              name="company_name"
              control={control}
              label="Company Name"
              required
              error={!!errors.company_name}
              helperText={errorMessages(errors.company_name?.message)}
              loading={loading}
            />
            <TextField
              name="email"
              control={control}
              label="Email"
              required
              letterCase="lowercase"
              error={!!errors.email}
              helperText={errorMessages(errors.email?.message)}
              loading={loading}
            />
            <TextField
              name="phone_no"
              control={control}
              label="Phone No"
              loading={loading}
            />
          </FormRow>
          <FormRow>
            <PhoneInputField
              name="mobile_no"
              control={control}
              label="Mobile No"
              required
              error={!!errors.mobile_no}
              helperText={errorMessages(errors.mobile_no?.message)}
              loading={loading}
            />
            <IndustryAutocomplete
              name="industry_id"
              control={control}
              required
              error={!!errors.industry_id}
              helperText={errorMessages(errors.industry_id?.message)}
              loading={loading}
            />

            <DatePicker
              name="company_start_date"
              control={control}
              label="Start Date"
              required
              error={!!errors.company_start_date}
              helperText={errorMessages(errors.company_start_date?.message)}
              loading={loading}
            />
          </FormRow>
          <FormRow>
            <CountryAutocomplete
              control={control}
              error={!!errors.country_id}
              helperText={errorMessages(errors.country_id?.message)}
              name="country_id"
              loading={loading}
              required
            />

            <StateAutocomplete
              control={control}
              error={!!errors.state_id}
              helperText={errorMessages(errors.state_id?.message)}
              name="state_id"
              countryId={countryId}
              disabled={!countryId}
              loading={loading}
              required
            />
            <CityAutocomplete
              control={control}
              error={!!errors.city_id}
              helperText={errorMessages(errors.city_id?.message)}
              name="city_id"
              stateId={stateId}
              disabled={!stateId}
              loading={loading}
              required
            />
          </FormRow>
          <FormRow>
            <TextField
              name="pin_code"
              control={control}
              label="Pincode"
              required
              error={!!errors.pin_code}
              helperText={errorMessages(errors.pin_code?.message)}
              loading={loading}
              placeholder="Enter Pincode"
            />
          </FormRow>
          <FormRow>
            <TextField
              name="address"
              control={control}
              label="Company Address"
              required
              multiline
              rows={4}
              error={!!errors.address}
              helperText={errorMessages(errors.address?.message)}
              loading={loading}
              placeholder="Enter Address"
            />

            <TextField
              name="about_company"
              control={control}
              label="About Company"
              multiline
              rows={4}
              error={!!errors.about_company}
              helperText={errorMessages(errors.about_company?.message)}
              loading={loading}
            />

            <TextField
              name="vision_and_mission"
              control={control}
              rows={4}
              label="Vision & Mission"
              multiline
              error={!!errors.vision_and_mission}
              helperText={errorMessages(errors.vision_and_mission?.message)}
              loading={loading}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

BasicDetailsForm.displayName = "BasicDetailsForm";
