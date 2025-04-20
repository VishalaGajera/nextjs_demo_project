import { Button, Dialog, TextField, toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { onError } from "../../../../../../../../../utils/errors";
import type { Document } from "../DocumentList/hooks/useGetDocuments";
import { useVerifyDocument } from "./hooks/useVerifyDocument";
import { documentKeys } from "../../../../../../../../../queryKeysFactories/document";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  verification_remark: z
    .string()
    .max(50, "Rejection reason cannot exceed 500 characters")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

type RejectDocumentDialogProps = {
  open: boolean;
  document: Document;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const RejectDocumentDialog = ({
  open,
  onClose,
  document,
  employeeId,
  onEditSuccess,
}: RejectDocumentDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      verification_remark: null,
    },
    resolver: zodResolver(schema),
  });

  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useVerifyDocument({
    employeeId,
    documentId: document.id,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: documentKeys.listing({}),
        });

        toasts.success({ title: data.message });
        onClose();
        onEditSuccess();
      },
      onError: (error) => onError(error),
    },
  });

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const rejectReason = handleSubmit((values) => {
    mutate({
      verification_status: "rejected",
      verification_remark: values.verification_remark ?? "",
    });
  });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Reject Document"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={() => {
              rejectReason();
            }}
            loading={isPending}
          >
            Reject
          </Button>
        </Stack>
      }
    >
      <Stack display="grid" gap="25px">
        <Typography variant="body1">
          Employee will Need to upload the document again.
        </Typography>

        <TextField
          name="verification_remark"
          label="Rejection Reason"
          control={control}
          multiline
          required
          error={!!errors.verification_remark}
          helperText={errorMessages(errors.verification_remark?.message)}
        />
      </Stack>
    </Dialog>
  );
};
