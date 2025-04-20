import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { SkillTypeHistoryList } from "./SkillTypeHistoryList";

type SkillTypeHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const SkillTypeHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: SkillTypeHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Skill Type History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SkillTypeHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
