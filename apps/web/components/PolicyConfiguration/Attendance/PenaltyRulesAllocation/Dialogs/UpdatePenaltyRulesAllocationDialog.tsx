import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { useEditPenaltyRulesAllocation } from "./hooks/useEditPenaltyRulesAllocation";
import {
  PenaltyRulesAllocationEditForm,
  type FormRef,
} from "./PenaltyRulesAllocationEditForm";

type UpdatePenaltyRulesAllocationDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeIds: string[];
  companyId: string;
};
export const UpdatePenaltyRulesAllocationDialog = ({
  employeeIds,
  open,
  onClose,
  onEditSuccess,
  companyId,
}: UpdatePenaltyRulesAllocationDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useEditPenaltyRulesAllocation({
    employeeIds,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onEditPenaltyRulesAllocation = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Attendance Penalty Rule"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditPenaltyRulesAllocation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <PenaltyRulesAllocationEditForm
        ref={formRef}
        employeeIds={employeeIds}
        companyId={companyId}
      />
    </Dialog>
  );
};
