import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import type { SkillType } from "../SkillTypeList/hooks/useGetSkillTypes";
import { useEditSkillType } from "./hooks/useEditSkillType";
import { useGetSkillType } from "./hooks/useGetSkillType";
import { type FormRef, SkillTypeForm } from "./SkillTypeForm";

type EditSkillTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  skillTypeId: SkillType["id"];
};

export const EditSkillTypeDialog = ({
  skillTypeId,
  open,
  onClose,
  onEditSuccess,
}: EditSkillTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: skillType, isPending: isPendingSkillTypeData } =
    useGetSkillType({
      skillTypeId,
    });

  const { mutate, isPending } = useEditSkillType({
    skillTypeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditSkillType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Skill Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSkillType}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SkillTypeForm
        ref={formRef}
        defaultValues={skillType}
        loading={isPendingSkillTypeData}
      />
    </Dialog>
  );
};
