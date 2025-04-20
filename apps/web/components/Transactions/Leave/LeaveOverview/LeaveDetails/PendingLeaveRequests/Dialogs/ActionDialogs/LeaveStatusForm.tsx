import { TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { filterChangedFormFields } from "../../../../../../../../utils/helper";

const LeaveStatusFormSchema = (status: "approved" | "rejected" | "cancelled") =>
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

export type LeaveStatusFormFieldValues = z.infer<
  ReturnType<typeof LeaveStatusFormSchema>
>;

type LeaveStatusFormProps = {
  loading?: boolean;
  status?: "approved" | "rejected" | "cancelled";
};

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LeaveStatusFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LeaveStatusFormFieldValues>;
};

const formDefaultValues: LeaveStatusFormFieldValues = {
  reason: null,
};

export const LeaveStatusForm = forwardRef(
  (
    { loading = false, status = "approved" }: LeaveStatusFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = useForm({
      defaultValues: formDefaultValues,
      resolver: zodResolver(LeaveStatusFormSchema(status)),
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
        label={
          status === "rejected"
            ? "Reject Remark"
            : // eslint-disable-next-line sonarjs/no-nested-conditional
              status === "cancelled"
              ? "Cancel Remark"
              : "Approve Remark"
        }
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

LeaveStatusForm.displayName = "LeaveStatusForm";
