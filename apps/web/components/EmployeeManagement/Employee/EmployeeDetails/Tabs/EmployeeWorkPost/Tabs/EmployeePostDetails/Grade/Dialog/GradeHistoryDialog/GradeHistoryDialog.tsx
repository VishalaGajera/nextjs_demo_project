import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { GradeHistoryList } from "./GradeHistoryList";

type GradeHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const GradeHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: GradeHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Grade History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <GradeHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
