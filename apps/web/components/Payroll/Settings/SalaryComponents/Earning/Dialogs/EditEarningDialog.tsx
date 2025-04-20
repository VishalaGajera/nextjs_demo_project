import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import { EarningForm, type FormRef } from "./EarningForm";
import { useEditEarning } from "./hooks/useEditEarning";
import { useGetEarning } from "./hooks/useGetEarning";

type EditEarningDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  earningId: string;
};

export const EditEarningDialog = ({
  earningId,
  open,
  onEditSuccess,
  onClose,
}: EditEarningDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: earningData, isPending: isPendingEarningData } = useGetEarning({
    earningId,
  });

  const { mutate, isPending } = useEditEarning({
    earningId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditEarning = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Earning"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditEarning}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EarningForm
        ref={formRef}
        defaultValues={earningData}
        loading={isPendingEarningData}
        dialogType="edit"
      />
    </Dialog>
  );
};
