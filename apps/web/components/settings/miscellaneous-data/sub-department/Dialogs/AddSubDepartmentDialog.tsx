import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { useAddSubDepartment } from "./hooks/useAddSubDepartment";
import {
  SubDepartmentForm,
  type FormRef,
  type SubDepartmentFormProps,
} from "./SubDepartmentForm";

type AddSubDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultValues?: SubDepartmentFormProps["defaultValues"];
  onAddSuccess: () => void;
};

export const AddSubDepartmentDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: AddSubDepartmentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddSubDepartment({
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

  const onCreateSubDepartment = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Sub Department"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateSubDepartment}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <SubDepartmentForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
