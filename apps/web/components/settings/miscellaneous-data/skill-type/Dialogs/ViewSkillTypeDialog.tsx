import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { SkillType } from "../SkillTypeList/hooks/useGetSkillTypes";
import { useGetSkillType } from "./hooks/useGetSkillType";
import { SkillTypeForm } from "./SkillTypeForm";

type ViewSkillTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  skillTypeId: SkillType["id"];
};

export const ViewSkillTypeDialog = ({
  skillTypeId,
  open,
  onClose,
}: ViewSkillTypeDialogProps) => {
  const { data: skillType, isPending: isPendingSkillTypeData } =
    useGetSkillType({
      skillTypeId,
    });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Skill Type"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SkillTypeForm
        defaultValues={skillType}
        loading={isPendingSkillTypeData}
        disabled
      />
    </Dialog>
  );
};
