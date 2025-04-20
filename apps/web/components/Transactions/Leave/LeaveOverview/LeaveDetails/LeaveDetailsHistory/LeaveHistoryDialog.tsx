import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { LeaveHistoryList } from "./LeaveHistoryList";

type LeaveHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  leaveTypeId: string;
  employeeId: string;
  dialogTitle: string;
};

export const LeaveHistoryDialog = ({
  onClose,
  open,
  leaveTypeId,
  employeeId,
  dialogTitle,
}: LeaveHistoryDialogProps) => {
  return (
    <BottomDialog
      onClose={onClose}
      open={open}
      title={`${dialogTitle} History`}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LeaveHistoryList leaveTypeId={leaveTypeId} employeeId={employeeId} />
    </BottomDialog>
  );
};
