import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { BulkLeaveForm, type FormRef } from "./BulkLeaveForm";
import { useBulkLeaveStatus } from "./hooks/useBulkLeaveStatus";

type ApproveBulkLeaveDialogProps = {
  open: boolean;
  onClose: () => void;
  onApproveSuccess: () => void;
  leaveRequestIds: string[];
};

export const ApproveBulkLeaveDialog = ({
  leaveRequestIds,
  open,
  onClose,
  onApproveSuccess,
}: ApproveBulkLeaveDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useBulkLeaveStatus({
    leaveRequestIds,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        onClose();
        onApproveSuccess();
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
      status: "approved" as const,
    };
  }, [leaveRequestIds]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Bulk Approve Leave Requests"
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
