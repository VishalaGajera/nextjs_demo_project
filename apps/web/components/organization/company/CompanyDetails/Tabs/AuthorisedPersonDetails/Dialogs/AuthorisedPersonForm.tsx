import {
  FormContainer,
  FormRow,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { filterChangedFormFields } from "../../../../../../../utils/helper";
import { ImageUploadField } from "../../../../../../common/ImageUploadField";
import type { PayloadAuthorisedPerson } from "./hooks/useAddAuthorisedPerson";

const AuthorisedPersonFormSchema = z.object({
  authorised_person_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  authorised_person_designation: z
    .string()
    .max(255, "common.maxLength")
    .nullable(),
  authorised_person_address: z.string().max(255, "common.maxLength").nullable(),
  authorised_person_photo: z.string().nullable(),
  authorised_person_signature: z.string().nullable(),
});

export type AuthorisedPersonFormFieldValues = z.infer<
  typeof AuthorisedPersonFormSchema
>;

type AuthorisedPersonFormProps = {
  defaultValues?: AuthorisedPersonFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<AuthorisedPersonFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<AuthorisedPersonFormFieldValues>;
};

const formDefaultValues: AuthorisedPersonFormFieldValues = {
  authorised_person_name: null,
  authorised_person_designation: null,
  authorised_person_address: null,
  authorised_person_photo: null,
  authorised_person_signature: null,
};

export const AuthorisedPersonForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: AuthorisedPersonFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(AuthorisedPersonFormSchema),
      mode: "all",
    });

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

          const payloadData: PayloadAuthorisedPerson = {
            authorised_person_name: filterFormValues.authorised_person_name,
            authorised_person_designation:
              filterFormValues.authorised_person_designation,
            authorised_person_address:
              filterFormValues.authorised_person_address,
            authorised_person_photo: filterFormValues.authorised_person_photo,
            authorised_person_signature:
              filterFormValues.authorised_person_signature,
          };

          onSubmit(payloadData);
        })();
      },
      setError,
    }));

    return (
      <FormContainer>
        <FormSection>
          <FormRow maxColumn={3}>
            <TextField
              name="authorised_person_name"
              control={control}
              label=" Name"
              required
              loading={loading}
              error={!!errors.authorised_person_name}
              helperText={errorMessages(errors.authorised_person_name?.message)}
            />
            <TextField
              name="authorised_person_designation"
              control={control}
              label=" Designation"
              loading={loading}
            />
            <TextField
              name="authorised_person_address"
              control={control}
              label=" Address"
              loading={loading}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <ImageUploadField
              control={control}
              name="authorised_person_photo"
              label=" Photo"
              loading={loading}
            />
            <ImageUploadField
              control={control}
              name="authorised_person_signature"
              label=" Signature"
              loading={loading}
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

AuthorisedPersonForm.displayName = "AuthorisedPersonForm";
