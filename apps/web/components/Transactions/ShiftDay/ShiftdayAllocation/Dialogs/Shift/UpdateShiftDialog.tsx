import { Button, dateFormats, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import { useEditShiftAllocation } from "../hooks/useEditShift";
import type { FormRef } from "./ShiftAllocationForm";
import { ShiftAllocationForm } from "./ShiftAllocationForm";

type UpdateShiftAllocationDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeIds: string[];
  companyId: string;
};
export const UpdateShiftAllocationDialog = ({
  employeeIds,
  open,
  onClose,
  onEditSuccess,
  companyId,
}: UpdateShiftAllocationDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useEditShiftAllocation({
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

  const onEditShiftAllocation = () => {
    formRef.current?.submitForm((formValues) => {
      const payload = {
        ...formValues,
        effective_from:
          formValues?.effective_from &&
          DateTime.fromISO(formValues.effective_from).toFormat(
            dateFormats.dateWithISO8601
          ),
        effective_to:
          formValues?.effective_to &&
          DateTime.fromISO(formValues.effective_to).toFormat(
            dateFormats.dateWithISO8601
          ),
        employee_id: employeeIds,
        current_date: DateTime.now().toISODate(),
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Shift"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditShiftAllocation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <ShiftAllocationForm
        ref={formRef}
        employeeIds={employeeIds}
        companyId={companyId}
      />
    </Dialog>
  );
};
