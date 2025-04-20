import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { StatutoryDetailsHistoryList } from "./StatutoryDetailsHistoryList/StatutoryDetailsHistoryList";

type StatutoryDetailsHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const StatutoryDetailsHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: StatutoryDetailsHistoryDialogProps) => {
  return (
    <BottomDialog
      onClose={onClose}
      open={open}
      title="Statutory Details History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <StatutoryDetailsHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
