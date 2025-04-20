import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { BankShiftHistoryList } from "./BankShiftHistoryList";

type BankShiftHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const BankShiftHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: BankShiftHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Bank Shift History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <BankShiftHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
