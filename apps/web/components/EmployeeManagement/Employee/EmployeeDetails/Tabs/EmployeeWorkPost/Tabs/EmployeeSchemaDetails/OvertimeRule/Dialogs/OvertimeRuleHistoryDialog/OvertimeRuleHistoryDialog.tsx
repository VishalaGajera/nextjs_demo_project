import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { OvertimeRuleHistoryList } from "./OvertimeRuleHistoryList";

type OvertimeRuleHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const OvertimeRuleHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: OvertimeRuleHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Overtime Rule History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <OvertimeRuleHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
