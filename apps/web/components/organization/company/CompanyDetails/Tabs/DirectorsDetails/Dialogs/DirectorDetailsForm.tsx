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
import type { PayloadDirector } from "./hooks/useAddDirectorDetails";

const DirectoreDetailFormSchema = z.object({
  company_id: z.string().optional().nullable(),
  director_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  director_designation: z.string().optional().nullable(),
  director_address: z.string().optional().nullable(),
  director_photo: z.string().optional().nullable(),
  director_signature: z.string().optional().nullable(),
});

export type DirectorDetailFormFieldValues = z.infer<
  typeof DirectoreDetailFormSchema
>;

type DirectorDetailProps = {
  defaultValues?: DirectorDetailFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<DirectorDetailFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<DirectorDetailFormFieldValues>;
};

const formDefaultValues: DirectorDetailFormFieldValues = {
  company_id: null,
  director_name: null,
  director_designation: null,
  director_address: null,
  director_photo: null,
  director_signature: null,
};

export const DirectorDetailForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: DirectorDetailProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(DirectoreDetailFormSchema),
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

          const payloadData: PayloadDirector = {
            director_name: filterFormValues.director_name,
            director_designation: filterFormValues.director_designation,
            director_address: filterFormValues.director_address,
            director_photo: filterFormValues.director_photo,
            director_signature: filterFormValues.director_signature,
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
            <TextField
              control={control}
              label="Name"
              name="director_name"
              loading={loading}
              required
              error={!!errors.director_name}
              helperText={errorMessages(errors.director_name?.message)}
            />
            <TextField
              control={control}
              label="Designation"
              name="director_designation"
              loading={loading}
              error={!!errors.director_designation}
              helperText={errorMessages(errors.director_designation?.message)}
            />
            <TextField
              control={control}
              label="Address"
              name="director_address"
              loading={loading}
              error={!!errors.director_address}
              helperText={errorMessages(errors.director_address?.message)}
            />
          </FormRow>
          <FormRow maxColumn={2}>
            <ImageUploadField
              control={control}
              name="director_photo"
              loading={loading}
              label="Photo"
            />
            <ImageUploadField
              control={control}
              name="director_signature"
              loading={loading}
              label="Signature"
            />
          </FormRow>
        </FormSection>
      </FormContainer>
    );
  }
);

DirectorDetailForm.displayName = "DirectorDetailForm";
