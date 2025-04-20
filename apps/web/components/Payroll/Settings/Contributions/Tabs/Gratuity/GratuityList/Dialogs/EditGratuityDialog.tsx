import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../common/EditAction";
import {
  GratuityForm,
  type GratuityFormRefProps,
} from "../../Dialogs/GratuityForm";
import { useGetGratuityById } from "./Hooks/getGratuityById";
import { useUpdateGratuity } from "./Hooks/useUpdateGratuity";

type EditGratuityDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  gratuityId: string;
};

export const EditGratuityDialog = ({
  onClose,
  onEditSuccess,
  gratuityId,
  open,
}: EditGratuityDialogProps) => {
  const gratuityFormRef = useRef<GratuityFormRefProps>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data, isPending: loading } = useGetGratuityById({
    gratuityId,
  });

  const { mutate, isPending } = useUpdateGratuity({
    gratuityId,
    options: {
      onSuccess: (success) => {
        onEditSuccess();

        onClose();

        toasts.success({
          title: success.message,
        });
      },
      onError: (error) => onError(error),
    },
  });

  const handleEditButton = () => {
    gratuityFormRef.current?.submitForm((formValue) => {
      mutate(formValue);
    });
  };

  return (
    <Dialog
      title="Edit Gratuity"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={handleEditButton}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <GratuityForm
        defaultValues={data}
        loading={loading}
        ref={gratuityFormRef}
        type="update"
      />
    </Dialog>
  );
};
