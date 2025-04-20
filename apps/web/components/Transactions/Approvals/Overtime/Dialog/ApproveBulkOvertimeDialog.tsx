import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { BulkOvertimeForm, type FormRef } from "./BulkOvertimeForm";
import { useBulkOvertimeStatus } from "./hooks/useBulkOvertimeStatus";

type ApproveBulkOvertimeDialogProps = {
  open: boolean;
  onClose: () => void;
  onApproveSuccess: () => void;
  overtimeRequestIds: string[];
};

export const ApproveBulkOvertimeDialog = ({
  overtimeRequestIds,
  open,
  onClose,
  onApproveSuccess,
}: ApproveBulkOvertimeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useBulkOvertimeStatus({
    overtimeRequestIds,
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
      overtime_request_ids: overtimeRequestIds,
      status: "approved" as const,
    };
  }, [overtimeRequestIds]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Bulk Approve Overtime Requests"
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
      <BulkOvertimeForm ref={formRef} defaultValues={initialValues} />
    </Dialog>
  );
};
