import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { ShiftHistoryList } from "./ShiftHistoryList";

type ShiftHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const ShiftHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: ShiftHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Shift History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <ShiftHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
