import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { WorkTypeHistoryList } from "./WorkTypeHistoryList";

type WorkTypeHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const WorkTypeHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: WorkTypeHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Work Type History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <WorkTypeHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
