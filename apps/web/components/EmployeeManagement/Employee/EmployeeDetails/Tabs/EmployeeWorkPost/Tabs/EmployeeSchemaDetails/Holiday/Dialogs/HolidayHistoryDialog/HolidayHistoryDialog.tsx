import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { HolidayHistoryList } from "./HolidayHistoryList";

type HolidayHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const HolidayHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: HolidayHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Holiday History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <HolidayHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
