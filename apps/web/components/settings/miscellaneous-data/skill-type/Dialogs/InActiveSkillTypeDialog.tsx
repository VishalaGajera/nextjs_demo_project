import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditSkillType } from "./hooks/useEditSkillType";

type InActiveSkillTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skillTypeId: string;
  skillTypeName: string;
};

export const InActiveSkillTypeDialog = ({
  skillTypeId,
  open,
  onClose,
  onSuccess,
  skillTypeName,
}: InActiveSkillTypeDialogProps) => {
  const { mutate } = useEditSkillType({
    skillTypeId,
    options: {
      onSuccess: ({ message }) => {
        onClose();
        onSuccess();
        toasts.success({ title: message });
      },
    },
  });

  return (
    <BottomDialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={`Inactive ${skillTypeName} Skill Type`}
    >
      <InActiveBottomDialogBody
        sectionId={skillTypeId}
        section="skill_type"
        alertKey="Skill type"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
