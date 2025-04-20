import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { LeavePlanHistoryList } from "./LeavePlanHistoryList";

type LeavePlanHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const LeavePlanHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: LeavePlanHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Leave Plan History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LeavePlanHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
