import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { useEditLeaveType } from "./hooks/useEditLeaveType";
import { useGetLeaveType } from "./hooks/useGetLeaveType";
import type { FormRef } from "./LeaveTypeForm";
import { LeaveTypeForm } from "./LeaveTypeForm";

type EditLeaveTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  leaveTypeId: string;
};
export const EditLeaveTypeDialog = ({
  leaveTypeId,
  open,
  onClose,
  onEditSuccess,
}: EditLeaveTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: latestLeaveTypeData, isPending: isPendingLeaveTypeData } =
    useGetLeaveType({
      leaveTypeId,
    });

  const { mutate, isPending } = useEditLeaveType({
    leaveTypeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onEditLeaveType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Leave Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditLeaveType}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <LeaveTypeForm
        ref={formRef}
        defaultValues={latestLeaveTypeData}
        loading={isPendingLeaveTypeData}
      />
    </Dialog>
  );
};
