import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../utils/errors";
import { useAddPastWorkEmployment } from "./hooks/useAddPastWorkEmployment";
import type { FormRef } from "./PastWorkEmploymentForm";
import { PastWorkEmploymentForm } from "./PastWorkEmploymentForm";

type AddPastWorkEmploymentDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  employeeId: string;
};

export const AddPastWorkEmploymentDialog = ({
  open,
  onClose,
  onAddSuccess,
  employeeId,
}: AddPastWorkEmploymentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddPastWorkEmployment({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onAddSuccess)) {
          onAddSuccess();
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreatePastWorkEmployment = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Past work Employment"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreatePastWorkEmployment}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <PastWorkEmploymentForm employeeId={employeeId} ref={formRef} />
    </Dialog>
  );
};
