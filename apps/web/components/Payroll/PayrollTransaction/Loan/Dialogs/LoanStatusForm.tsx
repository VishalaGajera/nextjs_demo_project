import { TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { filterChangedFormFields } from "../../../../../utils/helper";

export type DecisionStatus = "approved" | "rejected" | "cancelled";

const LoanStatusFormSchema = (status: DecisionStatus) =>
  z
    .object({
      reason: z.string().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      if (status !== "approved" && !data.reason) {
        ctx.addIssue({
          path: ["reason"],
          code: "custom",
          message: "common.required",
        });
      }
    });

export type LoanStatusFormFieldValues = z.infer<
  ReturnType<typeof LoanStatusFormSchema>
>;

type LoanStatusFormProps = {
  loading?: boolean;
  status?: DecisionStatus;
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LoanStatusFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LoanStatusFormFieldValues>;
};

const formDefaultValues: LoanStatusFormFieldValues = {
  reason: null,
};

export const LoanStatusForm = forwardRef(
  (
    { loading = false, status = "approved" }: LoanStatusFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const getActionLabel = (status: DecisionStatus) => {
      const actionMap = {
        approved: "approve",
        rejected: "reject",
        cancelled: "cancel",
      };

      return `${capitalize(actionMap[status] || status)} Remark`;
    };

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      defaultValues: formDefaultValues,
      resolver: zodResolver(LoanStatusFormSchema(status)),
      mode: "all",
    });

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
      <TextField
        control={control}
        label={getActionLabel(status)}
        required={status !== "approved"}
        name="reason"
        fullWidth
        multiline
        loading={loading}
        error={!!errors.reason}
        helperText={errorMessages(errors.reason?.message)}
      />
    );
  }
);

LoanStatusForm.displayName = "LoanStatusForm";
