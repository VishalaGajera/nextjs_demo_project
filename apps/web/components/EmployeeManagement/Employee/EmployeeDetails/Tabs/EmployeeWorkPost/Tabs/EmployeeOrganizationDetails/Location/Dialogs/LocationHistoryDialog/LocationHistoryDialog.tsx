import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { LocationHistoryList } from "./LocationHistoryList";

type LocationHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const LocationHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: LocationHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Location History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LocationHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
