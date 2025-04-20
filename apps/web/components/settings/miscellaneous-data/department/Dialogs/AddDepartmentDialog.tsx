import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import {
  DepartmentForm,
  type DepartmentFormProps,
  type FormRef,
} from "./DepartmentForm";

import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { useAddDepartment } from "./hooks/useAddDepartment";

type AddDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  defaultValues?: DepartmentFormProps["defaultValues"];
};

export const AddDepartmentDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: AddDepartmentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddDepartment({
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

  const onCreateDepartment = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Department"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateDepartment}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <DepartmentForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
