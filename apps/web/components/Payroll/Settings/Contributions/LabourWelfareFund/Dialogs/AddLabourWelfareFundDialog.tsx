import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import {
  LabourWelfareFundForm,
  type FormRef,
} from "../LabourWelfareFundForm/LabourWelfareFundForm";

import { onError } from "../../../../../../utils/errors";
import { useAddLabourWelfareFund } from "./hooks/useAddLabourWelfareFund";

type AddLabourWelfareFundDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
};

const AddLabourWelfareFundDialog = ({
  open,
  onClose,
  onAddSuccess,
}: AddLabourWelfareFundDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddLabourWelfareFund({
    options: {
      onSuccess: (data) => {
        onClose();
        onAddSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onAddLabourWelfareFund = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Add Labour Welfare Fund"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onAddLabourWelfareFund}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <LabourWelfareFundForm ref={formRef} />
    </Dialog>
  );
};

export default AddLabourWelfareFundDialog;
