import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { WeeklyOffHistoryList } from "./WeeklyOffHistoryList";

type WeeklyOffHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const WeeklyOffHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: WeeklyOffHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Weekly Off History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <WeeklyOffHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
