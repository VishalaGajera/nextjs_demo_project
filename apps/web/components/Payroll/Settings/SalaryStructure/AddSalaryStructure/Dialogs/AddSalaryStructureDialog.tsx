import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { type FormRef, SalaryStructureForm } from "../SalaryStructureForm";
import { useAddSalaryStructure } from "./Hooks/useAddSalaryStructure";

type AddSalaryStructureDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
};

export const AddSalaryStructureDialog = ({
  onClose,
  onAddSuccess,
  open,
}: AddSalaryStructureDialogProps) => {
  const salaryStructureFormRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddSalaryStructure({
    options: {
      onSuccess: (success) => {
        onAddSuccess();

        onClose();

        toasts.success({
          title: success.message,
        });
      },
      onError: (error) =>
        onError(error, salaryStructureFormRef.current?.setError),
    },
  });

  const handleSaveButton = () => {
    salaryStructureFormRef.current?.submitForm((formValue) => {
      mutate(formValue);
    });
  };

  return (
    <Dialog
      title="Add Salary Structure"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            loading={isPending}
            disabled={isDisabled()}
            onClick={handleSaveButton}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <SalaryStructureForm ref={salaryStructureFormRef} />
    </Dialog>
  );
};
