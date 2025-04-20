import {
  FormContainer,
  FormRow,
  FormSection,
  PhoneInputField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { filterChangedFormFields } from "../../../../../../../../../utils/helper";

import { useEnableDisableButton } from "../../../../../../../../../hooks/useEnableDisableButton";
import { isValidMobileNumber } from "../../../../../../../../../utils/mobileNumberValidate";
import { emailRegex } from "../../../../../../../../../utils/regex";
import { EmergencyRelationAutocomplete } from "../../../../../../../../common/Autocomplete/RelationshipAutocomplete/EmergencyRelationAutocomplete";
import type { Payload } from "../hooks/useEditEmergencyContact";

const EmergencyContactScheme = z.object({
  primary_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  primary_relation: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  primary_mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  primary_address: z
    .string()
    .max(255, "common.maxLength")
    .optional()
    .nullable(),
  primary_email: z
    .string()
    .regex(emailRegex, "common.email.invalid")
    .optional()
    .nullable(),
  secondary_name: z.string().max(255, "common.maxLength").optional().nullable(),
  secondary_relation: z.string().optional().nullable(),
  secondary_mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .optional()
    .nullable(),
  secondary_address: z
    .string()
    .max(255, "common.maxLength")
    .optional()
    .nullable(),
  secondary_email: z
    .string()
    .regex(emailRegex, "common.email.invalid")
    .optional()
    .nullable(),
});

export type EmergencyContactFormFieldValues = z.infer<
  typeof EmergencyContactScheme
>;

type EmergencyContactProps = {
  defaultValues?: EmergencyContactFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  submitForm: (onSubmit: (formValues: Payload) => void) => void;
  setError: UseFormSetError<EmergencyContactFormFieldValues>;
};

const formDefaultValues: EmergencyContactFormFieldValues = {
  primary_name: null,
  primary_relation: null,
  primary_mobile_no: null,
  primary_address: null,
  primary_email: null,
  secondary_name: null,
  secondary_relation: null,
  secondary_mobile_no: null,
  secondary_address: null,
  secondary_email: null,
};

export const EmergencyContactForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading }: EmergencyContactProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { butterflyBlue } = theme.palette.app.color;

    const {
      watch,
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(EmergencyContactScheme),
      mode: "all",
    });

    const secondaryMobileNo = watch("secondary_mobile_no");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            {
              ...formValues,
              secondary_mobile_no: secondaryMobileNo ? secondaryMobileNo : null,
            },
            {
              ...dirtyFields,
              secondary_mobile_no: defaultValues.secondary_mobile_no
                ? dirtyFields.secondary_mobile_no
                : !!secondaryMobileNo,
            }
          );

          const payloadData: Payload = {
            primary: {
              name: filterFormValues.primary_name,
              email: filterFormValues.primary_email,
              relation: filterFormValues.primary_relation,
              mobile_no: filterFormValues.primary_mobile_no,
              address: filterFormValues.primary_address,
            },
            secondary: {
              name: filterFormValues.secondary_name,
              email: filterFormValues.secondary_email,
              relation: filterFormValues.secondary_relation,
              mobile_no: filterFormValues.secondary_mobile_no,
              address: filterFormValues.secondary_address,
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

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={1}>
            <Typography
              variant="body1"
              sx={{
                color: butterflyBlue[900],
              }}
            >
              Primary
            </Typography>
          </FormRow>
          <FormRow maxColumn={2}>
            <TextField
              control={control}
              label="Name"
              name="primary_name"
              loading={loading}
              required
              error={!!errors.primary_name}
              helperText={errorMessages(errors.primary_name?.message)}
            />

            <EmergencyRelationAutocomplete
              control={control}
              name="primary_relation"
              required
              error={!!errors.primary_relation}
              helperText={errorMessages(errors.primary_relation?.message)}
              loading={loading}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <PhoneInputField
              control={control}
              label="Mobile No"
              name="primary_mobile_no"
              loading={loading}
              required
              error={!!errors.primary_mobile_no}
              helperText={errorMessages(errors.primary_mobile_no?.message)}
            />
            <TextField
              control={control}
              label="Address"
              name="primary_address"
              loading={loading}
            />
          </FormRow>
          <FormRow maxColumn={1}>
            <TextField
              name="primary_email"
              control={control}
              loading={loading}
              label="Email"
              letterCase="lowercase"
              error={!!errors.primary_email}
              helperText={errorMessages(errors.primary_email?.message)}
            />
          </FormRow>
          <FormRow maxColumn={1}>
            <Typography
              variant="body1"
              sx={{
                color: butterflyBlue[900],
                mt: 2,
              }}
            >
              Secondary
            </Typography>
          </FormRow>
          <FormRow maxColumn={2}>
            <TextField
              control={control}
              label="Name"
              name="secondary_name"
              loading={loading}
            />

            <EmergencyRelationAutocomplete
              control={control}
              name="secondary_relation"
              loading={loading}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <PhoneInputField
              control={control}
              label="Mobile"
              name="secondary_mobile_no"
              loading={loading}
              error={!!errors.secondary_mobile_no}
              helperText={errorMessages(errors.secondary_mobile_no?.message)}
            />
            <TextField
              control={control}
              label="Address"
              name="secondary_address"
              loading={loading}
            />
          </FormRow>
          <FormRow maxColumn={1}>
            <TextField
              name="secondary_email"
              control={control}
              loading={loading}
              label="Email"
              letterCase="lowercase"
              error={!!errors.secondary_email}
              helperText={errorMessages(errors.secondary_email?.message)}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

EmergencyContactForm.displayName = " EmergencyContactForm";
