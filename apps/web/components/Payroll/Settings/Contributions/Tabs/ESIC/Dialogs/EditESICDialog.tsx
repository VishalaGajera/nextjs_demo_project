import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import type { FormRef } from "./ESICForm";
import { ESICForm } from "./ESICForm";
import { useEditESIC } from "./hooks/useEditESIC";
import { useGetESIC } from "./hooks/useGetESIC";

type EditESICDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  esicId: string;
};

export const EditESICDialog = ({
  esicId,
  open,
  onEditSuccess,
  onClose,
}: EditESICDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: esicData, isPending: isPendingESICData } = useGetESIC({
    esicId,
  });

  const { mutate, isPending } = useEditESIC({
    esicId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditESIC = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit ESIC"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditESIC}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <ESICForm
        ref={formRef}
        defaultValues={esicData}
        loading={isPendingESICData}
        dialogType="edit"
      />
    </Dialog>
  );
};
