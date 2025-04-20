import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { BulkLeaveForm, type FormRef } from "./BulkLeaveForm";
import { useBulkLeaveStatus } from "./hooks/useBulkLeaveStatus";
import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";

type RejectBulkLeaveDialogProps = {
  open: boolean;
  onClose: () => void;
  onRejectSuccess: () => void;
  leaveRequestIds: string[];
};

export const RejectBulkLeaveDialog = ({
  leaveRequestIds,
  open,
  onClose,
  onRejectSuccess,
}: RejectBulkLeaveDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useBulkLeaveStatus({
    leaveRequestIds,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        onClose();
        onRejectSuccess();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const initialValues = useMemo(() => {
    return {
      leave_request_ids: leaveRequestIds,
      status: "rejected" as const,
      remark: null,
    };
  }, [leaveRequestIds]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Bulk Reject Leave Requests"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            disabled={isDisabled()}
            onClick={handleSubmit}
            loading={isPending}
            variant="contained"
          >
            Confirm
          </Button>
        </Stack>
      }
    >
      <BulkLeaveForm ref={formRef} defaultValues={initialValues} />
    </Dialog>
  );
};
