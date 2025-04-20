import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { ReportingManagerHistoryList } from "./ReportingManagerHistoryList";

type ReportingManagerHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};
export const ReportingManagerHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: ReportingManagerHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Reporting Manager History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <ReportingManagerHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
