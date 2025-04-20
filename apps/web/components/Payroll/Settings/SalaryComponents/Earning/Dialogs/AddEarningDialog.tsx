import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import {
  EarningForm,
  type EarningFormProps,
  type FormRef,
} from "./EarningForm";
import { useAddEarning } from "./hooks/useAddEarning";

type EarningDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  defaultValues?: EarningFormProps["defaultValues"];
};

export const AddEarningDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: EarningDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddEarning({
    options: {
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreateEarning = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Earning"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateEarning}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <EarningForm
        ref={formRef}
        defaultValues={defaultValues}
        dialogType="add"
      />
    </Dialog>
  );
};
