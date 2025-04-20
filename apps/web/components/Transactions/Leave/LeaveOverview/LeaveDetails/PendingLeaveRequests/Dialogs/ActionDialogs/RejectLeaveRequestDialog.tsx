import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../utils/errors";
import { useGetLeaveRequest } from "../hooks/useGetPendingLeaveRequest";
import { LeaveDetailsSection } from "./LeaveDetailsSection";
import { type FormRef, LeaveStatusForm } from "./LeaveStatusForm";
import { useEditLeaveStatus } from "./hooks/useEditLeaveStatus";

type RejectLeaveRequestDialogProps = {
  leaveRequestId: string;
  employeeId: string;
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
};

export const RejectLeaveRequestDialog = ({
  leaveRequestId,
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: RejectLeaveRequestDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: LeaveRequestDetails, isLoading: isLeaveRequestDetailsLoading } =
    useGetLeaveRequest({ leaveRequestId, employeeId });

  const { mutate, isPending } = useEditLeaveStatus({
    leaveRequestId,
    employeeId,
    status: "rejected",
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
      title="Reject Leave"
      open={open}
      isHideDividers
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onEditLeaveRequest}
            loading={isPending}
            disabled={isDisabled()}
          >
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
          status="rejected"
          loading={isLeaveRequestDetailsLoading}
        />
      </Stack>
    </Dialog>
  );
};
