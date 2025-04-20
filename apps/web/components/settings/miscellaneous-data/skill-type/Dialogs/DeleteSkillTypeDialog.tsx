import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { SkillType } from "../SkillTypeList/hooks/useGetSkillTypes";
import { useDeleteSkillType } from "./hooks/useDeleteSkillType";

type DeleteSkillTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  skillType: SkillType;
};

export const DeleteSkillTypeDialog = ({
  skillType,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteSkillTypeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteSkillType({
    skillTypeId: skillType.id,
    options: {
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <DeleteDialog
      title={t("skillType.dialog.delete.message", {
        skillTypeName: skillType.skill_type_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
