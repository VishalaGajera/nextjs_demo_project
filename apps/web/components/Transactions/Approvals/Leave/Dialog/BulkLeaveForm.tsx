import { TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";

import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const BulkLeaveFormSchema = z.object({
  leave_request_ids: z.array(z.string()).nullable(),
  remark: z.string().nullable().optional(),
  status: z.enum(["approved", "rejected"]),
});

export type BulkLeaveFormValues = z.infer<typeof BulkLeaveFormSchema>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BulkLeaveFormValues>) => void
  ) => void;
  setError: UseFormSetError<BulkLeaveFormValues>;
};

type BulkLeaveFormProps = {
  defaultValues: BulkLeaveFormValues;
};

export const BulkLeaveForm = forwardRef(
  ({ defaultValues }: BulkLeaveFormProps, ref: ForwardedRef<FormRef>) => {
    const { t } = useTranslation();

    const UpdatedBulkLeaveFormSchema = BulkLeaveFormSchema.superRefine(
      (val, ctx) => {
        if (defaultValues.status === "rejected" && !val.remark) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["remark"],
          });
        }
      }
    );

    const {
      watch,
      setError,
      control,
      formState: { errors },
      handleSubmit,
    } = useForm<BulkLeaveFormValues>({
      values: defaultValues,
      resolver: zodResolver(UpdatedBulkLeaveFormSchema),
      mode: "all",
    });

    const leaveRequestIds = watch("leave_request_ids") ?? [];

    const status = watch("status");

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(formValues);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    return (
      <Stack gap="20px">
        <Typography>{`Do you want to ${status === "approved" ? "approve" : "reject"} ${leaveRequestIds.length} leave requests?`}</Typography>

        {status === "rejected" && (
          <TextField
            name="remark"
            control={control}
            label="Remark"
            required
            error={!!errors.remark}
            helperText={errorMessages(errors.remark?.message)}
          />
        )}
      </Stack>
    );
  }
);

BulkLeaveForm.displayName = "BulkLeaveForm";
