import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { PaymentDetailsHistoryList } from "./PaymentDetailsHistoryList/PaymentDetailsHistoryList";

type PaymentHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const PaymentHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: PaymentHistoryDialogProps) => {
  return (
    <BottomDialog
      onClose={onClose}
      open={open}
      title="Payment Details History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <PaymentDetailsHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
