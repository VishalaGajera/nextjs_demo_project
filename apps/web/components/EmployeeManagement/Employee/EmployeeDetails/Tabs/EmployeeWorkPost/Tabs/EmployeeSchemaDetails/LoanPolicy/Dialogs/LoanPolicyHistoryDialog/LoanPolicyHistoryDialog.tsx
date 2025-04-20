import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { LoanPolicyHistoryList } from "./LoanPolicyHistoryList";

type LoanPolicyHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const LoanPolicyHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: LoanPolicyHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Loan Policy History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LoanPolicyHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
