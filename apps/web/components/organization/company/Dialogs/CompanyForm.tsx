import {
  DatePicker,
  FormContainer,
  FormRow,
  FormSection,
  TextField,
  PhoneInputField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  resetDependentFields,
} from "../../../../utils/helper";
import { isValidMobileNumber } from "../../../../utils/mobileNumberValidate";
import {
  cinNoRegex,
  emailRegex,
  esiNoRegex,
  gstNoRegex,
  panCardRegex,
  phoneNumberRegex,
  pinCodeRegex,
  ptNoRegex,
  tanNoRegex,
} from "../../../../utils/regex";
import { CityAutocomplete } from "../../../common/Autocomplete/CityAutocomplete";
import { CountryAutocomplete } from "../../../common/Autocomplete/CountryAutocomplete";
import { EmployeeCodeTypeAutocomplete } from "../../../common/Autocomplete/EmployeeCodeTypeAutocomplete";
import { EmployeeCodeTypeSchema } from "../../../common/Autocomplete/hooks/useGetEmployeeCodeTypeOptions";
import { IndustryAutocomplete } from "../../../common/Autocomplete/IndustryAutocomplete";
import { StateAutocomplete } from "../../../common/Autocomplete/StateAutocomplete";
import { ImageUploadField } from "../../../common/ImageUploadField";
import type { CompanyPayload } from "./hooks/useAddCompany";

const CompanyFormSchema = z.object({
  about_company: z.string().max(255, "common.maxLength").nullable(),
  address: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  cin_no: z.string().regex(cinNoRegex, "common.cin_no.invalid").nullable(),
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
  esi_no: z.string().regex(esiNoRegex, "common.esi_no.invalid").nullable(),
  gst_no: z.string().regex(gstNoRegex, "common.gst_no.invalid").nullable(),
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
  pan_no: z
    .string()
    .regex(panCardRegex, "document.pan_card_no.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  pf_no: z.string().nullable(),
  phone_no: z
    .string()
    .regex(phoneNumberRegex, "common.phoneNumber.invalid")
    .nullable(),
  pin_code: z
    .string()
    .regex(pinCodeRegex, "common.pinCode.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  employee_code_generation_type: EmployeeCodeTypeSchema,
  pt_no: z.string().regex(ptNoRegex, "common.pt_no.invalid").nullable(),
  registered_date: z.string().nullable(),
  state_id: z.string().nullable().optional(),
  tan_no: z.string().regex(tanNoRegex, "common.tan_no.invalid").nullable(),
  vision_and_mission: z.string().max(255, "common.maxLength").nullable(),
  company_logo: z.string().nullable(),
  license_no: z.string().nullable(),
  lwf_est_code: z.string().nullable(),
});

export type CompanyFormFieldValues = z.infer<typeof CompanyFormSchema>;

type CompanyFormProps = {
  defaultValues?: CompanyFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (onSubmit: (formValues: CompanyPayload) => void) => void;
  setError: UseFormSetError<CompanyFormFieldValues>;
};

const formDefaultValues: CompanyFormFieldValues = {
  about_company: null,
  address: null,
  cin_no: null,
  city_id: null,
  company_logo: null,
  company_name: null,
  company_start_date: null,
  country_id: null,
  email: null,
  employee_code_generation_type: "both",
  esi_no: null,
  gst_no: null,
  industry_id: null,
  mobile_no: null,
  pan_no: null,
  pf_no: null,
  phone_no: null,
  pin_code: null,
  pt_no: null,
  registered_date: null,
  state_id: null,
  tan_no: null,
  vision_and_mission: null,
  license_no: null,
  lwf_est_code: null,
};

export const CompanyForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: CompanyFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const updatedVariantValueSchema = CompanyFormSchema.superRefine(
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

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            employee_code_generation_type: true,
          });

          const payloadData: CompanyPayload = {
            basic_details: {
              company_name: filterFormValues.company_name,
              email: filterFormValues.email,
              phone_no: filterFormValues.phone_no,
              mobile_no: filterFormValues.mobile_no,
              company_start_date: filterFormValues.company_start_date,
              industry_id: filterFormValues.industry_id,
              address: filterFormValues.address,
              city_id: filterFormValues.city_id,
              state_id: filterFormValues.state_id,
              country_id: filterFormValues.country_id,
              pin_code: filterFormValues.pin_code,
              employee_code_generation_type:
                filterFormValues.employee_code_generation_type,
              company_logo: filterFormValues.company_logo,
              about_company: filterFormValues.about_company,
              vision_and_mission: filterFormValues.vision_and_mission,
            },
            statutory_details: {
              cin_no: filterFormValues.cin_no,
              registered_date: filterFormValues.registered_date,
              pan_no: filterFormValues.pan_no,
              tan_no: filterFormValues.tan_no,
              pf_no: filterFormValues.pf_no,
              esi_no: filterFormValues.esi_no,
              gst_no: filterFormValues.gst_no,
              pt_no: filterFormValues.pt_no,
              license_no: filterFormValues.license_no,
              lwf_est_code: filterFormValues.lwf_est_code,
            },
          };

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const dependentFieldsMap: Partial<
      Record<keyof CompanyFormFieldValues, (keyof CompanyFormFieldValues)[]>
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
        <FormSection title="Basic Details">
          <FormRow maxColumn={2}>
            <ImageUploadField
              control={control}
              name="company_logo"
              loading={loading}
              label="Company Logo"
            />
          </FormRow>

          <FormRow>
            <TextField
              control={control}
              label="Company Name"
              name="company_name"
              loading={loading}
              required
              error={!!errors.company_name}
              helperText={errorMessages(errors.company_name?.message)}
            />

            <TextField
              name="email"
              control={control}
              label="Email"
              loading={loading}
              required
              letterCase="lowercase"
              error={!!errors.email}
              helperText={errorMessages(errors.email?.message)}
            />

            <TextField
              control={control}
              label="Phone No"
              loading={loading}
              name="phone_no"
              error={!!errors.phone_no}
              helperText={errorMessages(errors.phone_no?.message)}
            />
          </FormRow>

          <FormRow>
            <PhoneInputField
              control={control}
              label="Mobile No"
              name="mobile_no"
              loading={loading}
              required
              error={!!errors.mobile_no}
              helperText={errorMessages(errors.mobile_no?.message)}
            />

            <IndustryAutocomplete
              name="industry_id"
              control={control}
              loading={loading}
              required
              error={!!errors.industry_id}
              helperText={errorMessages(errors.industry_id?.message)}
            />
            <DatePicker
              name="company_start_date"
              control={control}
              label="Start Date"
              loading={loading}
              required
              error={!!errors.company_start_date}
              helperText={errorMessages(errors.company_start_date?.message)}
            />
          </FormRow>

          <FormRow>
            <CountryAutocomplete
              control={control}
              loading={loading}
              error={!!errors.country_id}
              helperText={errorMessages(errors.country_id?.message)}
              name="country_id"
              required
            />

            <StateAutocomplete
              control={control}
              loading={loading}
              error={!!errors.state_id}
              helperText={errorMessages(errors.state_id?.message)}
              name="state_id"
              countryId={countryId}
              disabled={!countryId}
              required
            />
            <CityAutocomplete
              control={control}
              loading={loading}
              error={!!errors.city_id}
              helperText={errorMessages(errors.city_id?.message)}
              name="city_id"
              stateId={stateId}
              disabled={!stateId}
              required
            />
          </FormRow>

          <FormRow>
            <TextField
              name="pin_code"
              control={control}
              loading={loading}
              label="Pincode"
              required
              error={!!errors.pin_code}
              helperText={errorMessages(errors.pin_code?.message)}
              placeholder="Enter Pincode"
            />

            <EmployeeCodeTypeAutocomplete
              name="employee_code_generation_type"
              control={control}
              loading={loading}
              label="Employee Code Generation Type"
              required
              error={!!errors.employee_code_generation_type}
              helperText={errorMessages(
                errors.employee_code_generation_type?.message
              )}
            />
          </FormRow>

          <FormRow>
            <TextField
              name="address"
              control={control}
              loading={loading}
              label="Company Address"
              required
              multiline
              rows={4}
              error={!!errors.address}
              helperText={errorMessages(errors.address?.message)}
              placeholder="Enter Address"
            />

            <TextField
              name="about_company"
              control={control}
              loading={loading}
              label="About Company"
              multiline
              rows={4}
              error={!!errors.about_company}
              helperText={errorMessages(errors.about_company?.message)}
            />

            <TextField
              name="vision_and_mission"
              control={control}
              loading={loading}
              rows={4}
              label="Vision & Mission"
              multiline
              error={!!errors.vision_and_mission}
              helperText={errorMessages(errors.vision_and_mission?.message)}
            />
          </FormRow>
        </FormSection>

        <FormSection title="Statutory Details">
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
              error={!!errors.pf_no}
              helperText={errorMessages(errors.pf_no?.message)}
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
        </FormSection>
      </FormContainer>
    );
  }
);

CompanyForm.displayName = "CompanyForm";
