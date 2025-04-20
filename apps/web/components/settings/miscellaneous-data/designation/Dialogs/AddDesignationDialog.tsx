import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import {
  DesignationForm,
  type DesignationFormProps,
  type FormRef,
} from "./DesignationForm";

import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { useAddDesignation } from "./hooks/useAddDesignation";

type AddDesignationDialogProps = {
  open: boolean;
  defaultValues?: DesignationFormProps["defaultValues"];
  onClose: () => void;
  onAddSuccess: () => void;
};

export const AddDesignationDialog = ({
  open,
  defaultValues,
  onClose,
  onAddSuccess,
}: AddDesignationDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddDesignation({
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

  const onCreateDesignation = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Designation"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateDesignation}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <DesignationForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
