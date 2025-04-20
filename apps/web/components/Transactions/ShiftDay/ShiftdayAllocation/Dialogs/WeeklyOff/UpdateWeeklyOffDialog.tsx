import { Button, dateFormats, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import { useEditWeeklyOffAllocation } from "../hooks/useEditWeeklyOff";
import {
  WeeklyOffAllocationForm,
  type FormRef,
} from "./WeeklyOffAllocationForm";

type UpdateWeeklyOffAllocationDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeIds: string[];
  companyId: string;
};
export const UpdateWeeklyOffAllocationDialog = ({
  employeeIds,
  open,
  onClose,
  onEditSuccess,
  companyId,
}: UpdateWeeklyOffAllocationDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useEditWeeklyOffAllocation({
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

  const onEditWeeklyOffAllocation = () => {
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
      title="Edit Weekly Off"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditWeeklyOffAllocation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <WeeklyOffAllocationForm
        ref={formRef}
        employeeIds={employeeIds}
        companyId={companyId}
      />
    </Dialog>
  );
};
