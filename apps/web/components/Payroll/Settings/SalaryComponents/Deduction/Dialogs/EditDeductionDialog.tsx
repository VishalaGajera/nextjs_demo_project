import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import {
  type FormRef,
  type SalaryComponent,
  SalaryComponentForm,
} from "../../SalaryComponentForm";
import { useEditDeduction } from "./hooks/useEditDeduction";
import { useGetDeduction } from "./hooks/useGetDeduction";

type EditDeductionDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  deductionId: SalaryComponent["id"];
};

export const EditDeductionDialog = ({
  deductionId,
  open,
  onEditSuccess,
  onClose,
}: EditDeductionDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: deduction, isPending: isPendingLatestDeductionData } =
    useGetDeduction({
      deductionId,
    });

  const { mutate, isPending } = useEditDeduction({
    deductionId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditDeduction = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Deduction"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditDeduction}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SalaryComponentForm
        ref={formRef}
        defaultValues={deduction}
        loading={isPendingLatestDeductionData}
        type="deduction"
        dialogType="edit"
      />
    </Dialog>
  );
};
