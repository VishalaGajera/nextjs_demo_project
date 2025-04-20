import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { useAddSubCaste } from "./hooks/useAddSubCaste";
import type { FormRef, SubCasteFormProps } from "./SubCasteForm";
import { SubCasteForm } from "./SubCasteForm";

type AddSubCasteDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  defaultValues?: SubCasteFormProps["defaultValues"];
};

export const AddSubCasteDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: AddSubCasteDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddSubCaste({
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
      title="Add Sub Caste"
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
      <SubCasteForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
