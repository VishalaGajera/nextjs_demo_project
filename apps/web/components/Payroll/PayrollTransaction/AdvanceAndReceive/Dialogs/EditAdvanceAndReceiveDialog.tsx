import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";

import { EditAction } from "../../../../common/EditAction";
import {
  AddAdvanceAndReceiveForm,
  type FormRef,
} from "./AddAdvanceAndReceiveForm";

import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { useEditAdvanceAndReceive } from "./hooks/useEditAdvanceAndReceive";
import { useGetAdvanceAndReceive } from "./hooks/useGetAdvanceAndReceive";

type EditAdvanceAndReceiveDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  advanceAndReceiveId: string;
};

export const EditAdvanceAndReceiveDialog = ({
  advanceAndReceiveId,
  open,
  onEditSuccess,
  onClose,
}: EditAdvanceAndReceiveDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: advanceAndReceiveData,
    isPending: isPendingAdvanceAndReceiveData,
  } = useGetAdvanceAndReceive({
    advanceAndReceiveId,
  });

  const { mutate, isPending } = useEditAdvanceAndReceive({
    advanceAndReceiveId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditAdvanceAndReceive = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Advance & Receive"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditAdvanceAndReceive}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <AddAdvanceAndReceiveForm
        ref={formRef}
        defaultValues={advanceAndReceiveData}
        loading={isPendingAdvanceAndReceiveData}
      />
    </Dialog>
  );
};
