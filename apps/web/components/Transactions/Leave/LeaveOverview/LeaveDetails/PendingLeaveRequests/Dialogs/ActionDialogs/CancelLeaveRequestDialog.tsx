import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { onError } from "../../../../../../../../utils/errors";
import { useGetLeaveRequest } from "../hooks/useGetPendingLeaveRequest";
import { LeaveDetailsSection } from "./LeaveDetailsSection";
import { type FormRef, LeaveStatusForm } from "./LeaveStatusForm";
import { useEditLeaveStatus } from "./hooks/useEditLeaveStatus";

type CancelLeaveRequestDialogProps = {
  leaveRequestId: string;
  employeeId: string;
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
};

export const CancelLeaveRequestDialog = ({
  leaveRequestId,
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: CancelLeaveRequestDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { data: LeaveRequestDetails, isLoading: isLeaveRequestDetailsLoading } =
    useGetLeaveRequest({ leaveRequestId, employeeId });

  const { mutate, isPending } = useEditLeaveStatus({
    leaveRequestId,
    employeeId,
    status: "cancelled",
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onEditLeaveRequest = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      title="Cancel Leave Request"
      open={open}
      isHideDividers
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onEditLeaveRequest} loading={isPending}>
            Confirm
          </Button>
        </Stack>
      }
    >
      <Stack gap="30px">
        <LeaveDetailsSection
          LeaveRequestDetails={LeaveRequestDetails}
          isLeaveRequestDetailsLoading={isLeaveRequestDetailsLoading}
        />

        <LeaveStatusForm
          ref={formRef}
          status="cancelled"
          loading={isLeaveRequestDetailsLoading}
        />
      </Stack>
    </Dialog>
  );
};
