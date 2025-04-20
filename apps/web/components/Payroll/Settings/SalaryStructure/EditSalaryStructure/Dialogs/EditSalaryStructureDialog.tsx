import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import {
  SalaryStructureForm,
  type FormRef,
} from "../../AddSalaryStructure/SalaryStructureForm";
import { useEditSalaryStructure } from "./Hooks/useEditSalaryStructure";
import { useGetSalaryStructureById } from "./Hooks/useGetSalaryStructureById";
import { EditAction } from "../../../../../common/EditAction";

type EditSalaryStructureDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  ssId: string;
};

export const EditSalaryStructureDialog = ({
  onClose,
  onEditSuccess,
  open,
  ssId,
}: EditSalaryStructureDialogProps) => {
  const salaryStructureFormRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useEditSalaryStructure({
    ssId,
    options: {
      onSuccess: (success) => {
        onEditSuccess();

        onClose();

        toasts.success({
          title: success.message,
        });
      },
      onError: (error) =>
        onError(error, salaryStructureFormRef.current?.setError),
    },
  });

  const { data, isLoading } = useGetSalaryStructureById({ ssId });

  const handleSaveButton = () => {
    salaryStructureFormRef.current?.submitForm((formValue) => {
      mutate(formValue);
    });
  };

  return (
    <Dialog
      title="Edit Salary Structure"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            loading={isPending}
            disabled={isDisabled()}
            onClick={handleSaveButton}
          />
        </Stack>
      }
    >
      <SalaryStructureForm
        loading={isLoading}
        formType="update"
        ref={salaryStructureFormRef}
        defaultValues={data}
      />
    </Dialog>
  );
};
