import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";

import { TextField } from "@codezee/sixtify-brahma";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const BulkOvertimeFormSchema = z.object({
  overtime_request_ids: z.array(z.string()).nullable(),
  remark: z.string().nullable().optional(),
  status: z.enum(["approved", "rejected"]),
});

export type BulkOvertimeFormValues = z.infer<typeof BulkOvertimeFormSchema>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<BulkOvertimeFormValues>) => void
  ) => void;
  setError: UseFormSetError<BulkOvertimeFormValues>;
};

type BulkOvertimeFormProps = {
  defaultValues: BulkOvertimeFormValues;
};

export const BulkOvertimeForm = forwardRef(
  ({ defaultValues }: BulkOvertimeFormProps, ref: ForwardedRef<FormRef>) => {
    const { t } = useTranslation();

    const UpdatedBulkOvertimeFormSchema = BulkOvertimeFormSchema.superRefine(
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
    } = useForm<BulkOvertimeFormValues>({
      values: defaultValues,
      resolver: zodResolver(UpdatedBulkOvertimeFormSchema),
      mode: "all",
    });

    const overtimeRequestIds = watch("overtime_request_ids") ?? [];

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
        <Typography>{`Do you want to ${status === "approved" ? "approve" : "reject"} ${overtimeRequestIds.length} overtime requests?`}</Typography>

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

BulkOvertimeForm.displayName = "BulkOvertimeForm";
