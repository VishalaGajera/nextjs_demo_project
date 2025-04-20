import { FormRow, PhoneInputField, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../hooks/useEnableDisableButton";
import {
  filterChangedFormFields,
  resetDependentFields,
} from "../../../../utils/helper";
import { isValidMobileNumber } from "../../../../utils/mobileNumberValidate";
import {
  emailRegex,
  phoneNumberRegex,
  pinCodeRegex,
} from "../../../../utils/regex";
import { BusinessUnitAutocomplete } from "../../../common/Autocomplete/BusinessUnitAutocomplete";
import { BusinessUnitEmployeeAutoComplete } from "../../../common/Autocomplete/BusinessUnitEmployeeAutoComplete";
import { CityAutocomplete } from "../../../common/Autocomplete/CityAutocomplete";
import { CountryAutocomplete } from "../../../common/Autocomplete/CountryAutocomplete";
import { StateAutocomplete } from "../../../common/Autocomplete/StateAutocomplete";

const LocationFormFormSchema = z.object({
  business_unit_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  location_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  email: z.string().regex(emailRegex, "common.email.invalid").nullable(),
  phone_no: z
    .string()
    .regex(phoneNumberRegex, "common.phoneNumber.invalid")
    .nullable(),
  mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable(),
  address: z.string().max(255, "common.maxLength").nullable(),
  city_id: z.string().nullable(),
  state_id: z.string().nullable(),
  country_id: z.string().nullable(),
  pin_code: z.string().regex(pinCodeRegex, "common.pinCode.invalid").nullable(),
  business_unit_location_heads: z.array(z.string()).optional().nullable(),
});

export type LocationFormFieldValues = z.infer<typeof LocationFormFormSchema>;

type LocationFormProps = {
  defaultValues?: LocationFormFieldValues;
  loading?: boolean;
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LocationFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LocationFormFieldValues>;
};

const formDefaultValues: LocationFormFieldValues = {
  business_unit_id: null,
  location_name: null,
  email: null,
  phone_no: null,
  mobile_no: null,
  address: null,
  city_id: null,
  state_id: null,
  country_id: null,
  pin_code: null,
  business_unit_location_heads: null,
};

export const LocationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      disabled = false,
    }: LocationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(LocationFormFormSchema),
      mode: "all",
    });

    const {
      watch,
      control,
      setValue,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const countryId = watch("country_id");

    const stateId = watch("state_id");

    const businessUnitId = watch("business_unit_id");

    const mobileNo = watch("mobile_no");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            { ...formValues, mobile_no: mobileNo ? mobileNo : null },
            {
              ...dirtyFields,
              mobile_no: defaultValues.mobile_no
                ? dirtyFields.mobile_no
                : !!mobileNo,
            }
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const dependentFieldsMap: Partial<
      Record<keyof LocationFormFieldValues, (keyof LocationFormFieldValues)[]>
    > = {
      business_unit_id: ["business_unit_location_heads"],
      country_id: ["state_id", "city_id"],
      state_id: ["city_id"],
    };

    useMemo(() => {
      resetDependentFields({
        fieldName: "business_unit_id",
        fieldValue: businessUnitId,
        dirtyFields,
        setValue,
        dependentFieldsMap,
      });
    }, [businessUnitId]);

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
      <Stack gap="16px">
        <FormProvider {...methods}>
          <FormRow>
            <BusinessUnitAutocomplete
              isEnabled
              name="business_unit_id"
              control={control}
              loading={loading}
              disabled={!!defaultValues.business_unit_id || disabled}
              label="Business Unit"
              placeholder="Select Business Unit"
              required
              error={!!errors.business_unit_id}
              helperText={errorMessages(errors.business_unit_id?.message)}
            />

            <TextField
              label="Location Name"
              name="location_name"
              control={control}
              loading={loading}
              required
              error={!!errors.location_name}
              helperText={errorMessages(errors.location_name?.message)}
              disabled={disabled}
            />

            <TextField
              name="email"
              loading={loading}
              label="Email"
              control={control}
              letterCase="lowercase"
              error={!!errors.email}
              helperText={errorMessages(errors.email?.message)}
              disabled={disabled}
            />
          </FormRow>

          <FormRow>
            <BusinessUnitEmployeeAutoComplete
              control={control}
              label="Location Authorised Person"
              name="business_unit_location_heads"
              placeholder="Select Location Authorised Person"
              isShowAvatar
              isShowSelectAll={false}
              loading={loading}
              multiple
              businessUnitId={businessUnitId ?? ""}
              error={!!errors.business_unit_location_heads}
              helperText={errorMessages(
                errors.business_unit_location_heads?.message
              )}
              disabled={!businessUnitId || disabled}
            />

            <TextField
              name="address"
              loading={loading}
              control={control}
              label="Business Location Address"
              error={!!errors.address}
              helperText={errorMessages(errors.address?.message)}
              placeholder="Enter Address"
              disabled={disabled}
            />

            <PhoneInputField
              label="Mobile No"
              name="mobile_no"
              control={control}
              loading={loading}
              error={!!errors.mobile_no}
              helperText={errorMessages(errors.mobile_no?.message)}
              disabled={disabled}
            />
          </FormRow>

          <FormRow>
            <TextField
              label="Phone No"
              name="phone_no"
              control={control}
              loading={loading}
              error={!!errors.phone_no}
              helperText={errorMessages(errors.phone_no?.message)}
              disabled={disabled}
            />

            <CountryAutocomplete
              error={!!errors.country_id}
              loading={loading}
              control={control}
              helperText={errorMessages(errors.country_id?.message)}
              name="country_id"
              disabled={disabled}
            />

            <StateAutocomplete
              error={!!errors.state_id}
              helperText={errorMessages(errors.state_id?.message)}
              name="state_id"
              control={control}
              loading={loading}
              countryId={countryId}
              disabled={!countryId || disabled}
            />
          </FormRow>

          <FormRow>
            <CityAutocomplete
              error={!!errors.city_id}
              helperText={errorMessages(errors.city_id?.message)}
              name="city_id"
              loading={loading}
              control={control}
              stateId={stateId}
              disabled={!stateId || disabled}
            />

            <TextField
              name="pin_code"
              label="Pin code"
              control={control}
              loading={loading}
              error={!!errors.pin_code}
              helperText={errorMessages(errors.pin_code?.message)}
              placeholder="Enter Pin code"
              disabled={disabled}
            />
          </FormRow>
        </FormProvider>
      </Stack>
    );
  }
);

LocationForm.displayName = "LocationForm";
