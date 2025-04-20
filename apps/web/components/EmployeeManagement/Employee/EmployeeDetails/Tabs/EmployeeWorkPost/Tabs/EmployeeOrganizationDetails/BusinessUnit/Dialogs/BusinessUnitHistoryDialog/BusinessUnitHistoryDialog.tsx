import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { BusinessUnitHistoryList } from "./BusinessUnitHistoryList";

type BusinessUnitHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const BusinessUnitHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: BusinessUnitHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Business Unit History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <BusinessUnitHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
