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
import { useEditReimbursement } from "./hooks/useEditReimbursement";
import { useGetReimbursement } from "./hooks/useGetReimbursement";

type EditReimbursementDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  reimbursementId: SalaryComponent["id"];
};

export const EditReimbursementDialog = ({
  reimbursementId,
  open,
  onEditSuccess,
  onClose,
}: EditReimbursementDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: reimbursement, isPending: isPendingLatestReimbursementData } =
    useGetReimbursement({
      reimbursementId,
    });

  const { mutate, isPending } = useEditReimbursement({
    reimbursementId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditReimbursement = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Reimbursement"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditReimbursement}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SalaryComponentForm
        ref={formRef}
        defaultValues={reimbursement}
        loading={isPendingLatestReimbursementData}
        type="reimbursement"
        dialogType="edit"
      />
    </Dialog>
  );
};
