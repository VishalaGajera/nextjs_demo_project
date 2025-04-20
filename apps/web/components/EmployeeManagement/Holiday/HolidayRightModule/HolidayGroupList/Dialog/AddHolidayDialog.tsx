import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { HolidayForm, type FormRef } from "./HolidayForm";
import { useAddHoliday } from "./hooks/useAddHoliday";

type AddHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  holidayGroupId: string;
  onAddSuccess: () => void;
  year: string;
};

export const AddHolidayDialog = ({
  open,
  onClose,
  holidayGroupId,
  onAddSuccess,
  year,
}: AddHolidayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddHoliday({
    holidayGroupId,
    options: {
      onSuccess: (data) => {
        onAddSuccess();
        toasts.success({ title: data.message });
        onClose();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Holiday"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <HolidayForm ref={formRef} year={year} />
    </Dialog>
  );
};
