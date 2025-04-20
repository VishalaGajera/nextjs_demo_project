import { FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import {
  digitMaxLimit,
  filterChangedFormFields,
} from "../../../../../../../utils/helper";

const TaxSectionsFormSchema = z
  .object({
    section_code: z
      .string()
      .max(10)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    section_name: z
      .string()
      .max(50)
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    description: z.string().max(250).nullable(),
    section_max_limit: z.number().min(1).nullable().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.section_max_limit && values.section_max_limit >= digitMaxLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("value.maximum.allowedLimit", {
          maxLimit: 999999999,
        }),
        path: ["section_max_limit"],
      });
    }
  });

export type TaxSectionsFormFieldValues = z.infer<typeof TaxSectionsFormSchema>;

type TaxSectionsFormProps = {
  defaultValues?: TaxSectionsFormFieldValues;
  loading?: boolean;
  dialogType?: "add" | "edit" | "view";
  disabled?: boolean;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<TaxSectionsFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<TaxSectionsFormFieldValues>;
};

const formDefaultValues: TaxSectionsFormFieldValues = {
  section_code: null,
  section_name: null,
  description: null,
  section_max_limit: null,
};

export const TaxSectionsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      dialogType = "add",
      disabled = false,
    }: TaxSectionsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const isEdit = dialogType === "edit";

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(TaxSectionsFormSchema),
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
      <Stack gap="35px">
        <FormRow maxColumn={2}>
          <TextField
            name="section_code"
            control={control}
            label="Section Code"
            loading={loading}
            required
            error={!!errors.section_code}
            helperText={errorMessages(errors.section_code?.message)}
            disabled={isEdit || disabled}
          />

          <TextField
            name="section_name"
            control={control}
            label="Section Name"
            loading={loading}
            required
            error={!!errors.section_name}
            helperText={errorMessages(errors.section_name?.message)}
            disabled={disabled}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            name="description"
            control={control}
            loading={loading}
            label="Description"
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errorMessages(errors.description?.message)}
            disabled={disabled}
          />

          <TextField
            control={control}
            loading={loading}
            label="Section Maximum Limit"
            name="section_max_limit"
            type="number"
            error={!!errors.section_max_limit}
            helperText={errorMessages(errors.section_max_limit?.message)}
            disabled={disabled}
          />
        </FormRow>
      </Stack>
    );
  }
);

TaxSectionsForm.displayName = "TaxSectionsForm";
