import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { type FormRef } from "../../../../../EmployeeManagement/Holiday/HolidayRightModule/HolidayGroupList/Dialog/HolidayForm";
import { BankHolidayForm } from "./BankHolidayForm";
import { useAddBankHoliday } from "./hooks/useAddBankHoliday";

type AddBankHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onAddSuccess: () => void;
  year: string;
};

export const AddBankHolidayDialog = ({
  open,
  onClose,
  companyId,
  onAddSuccess,
  year,
}: AddBankHolidayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddBankHoliday({
    companyId,
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
      title="Add Bank Holiday"
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
      <BankHolidayForm ref={formRef} year={year} />
    </Dialog>
  );
};
