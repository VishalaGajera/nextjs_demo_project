import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import { GradeForm, type FormRef, type GradeFormProps } from "./GradeForm";

import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { useAddGrade } from "./hooks/useAddGrade";

type AddGradeDialogProps = {
  open: boolean;
  defaultValues?: GradeFormProps["defaultValues"];
  onClose: () => void;
  onAddSuccess: () => void;
};

export const AddGradeDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: AddGradeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddGrade({
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

  const onCreateGrade = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Grade"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateGrade}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <GradeForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
