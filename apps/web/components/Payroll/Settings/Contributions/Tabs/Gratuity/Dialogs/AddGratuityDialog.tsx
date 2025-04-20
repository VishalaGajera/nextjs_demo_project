import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { GratuityForm, type GratuityFormRefProps } from "./GratuityForm";
import { useAddGratuity } from "./Hooks/useAddGratuity";

type AddGratuityDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
};

export const AddGratuityDialog = ({
  onClose,
  onAddSuccess,
  open,
}: AddGratuityDialogProps) => {
  const gratuityFormRef = useRef<GratuityFormRefProps>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddGratuity({
    options: {
      onSuccess: (success) => {
        onAddSuccess();

        onClose();

        toasts.success({
          title: success.message,
        });
      },
      onError: (error) => onError(error),
    },
  });

  const handleSaveButton = () => {
    gratuityFormRef.current?.submitForm((formValue) => {
      mutate(formValue);
    });
  };

  return (
    <Dialog
      title="Add Gratuity"
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
      <GratuityForm ref={gratuityFormRef} type="add" />
    </Dialog>
  );
};
