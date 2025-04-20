import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { useAddWorkType } from "./hooks/useAddWorkType";
import {
  WorkTypeForm,
  type FormRef,
  type WorkTypeFormProps,
} from "./WorkTypeForm";

type AddWorkTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultValues?: WorkTypeFormProps["defaultValues"];
  onAddSuccess: () => void;
};

export const AddWorkTypeDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: AddWorkTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddWorkType({
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

  const onCreateWorkType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Work Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateWorkType}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <WorkTypeForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
