import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import {
  SkillTypeForm,
  type FormRef,
  type SkillTypeFormProps,
} from "./SkillTypeForm";

import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { useAddSkillType } from "./hooks/useAddSkillType";

type AddSkillTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultValues?: SkillTypeFormProps["defaultValues"];
  onAddSuccess: () => void;
};

export const AddSkillTypeDialog = ({
  open,
  onClose,
  defaultValues,
  onAddSuccess,
}: AddSkillTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddSkillType({
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

  const onCreateSkillType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Skill Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateSkillType}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <SkillTypeForm ref={formRef} defaultValues={defaultValues} />
    </Dialog>
  );
};
