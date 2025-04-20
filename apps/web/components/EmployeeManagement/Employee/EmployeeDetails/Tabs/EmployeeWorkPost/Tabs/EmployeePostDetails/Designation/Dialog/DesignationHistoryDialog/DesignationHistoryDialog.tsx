import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { DesignationHistoryList } from "./DesignationHistoryList";

type DesignationHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const DesignationHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: DesignationHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Designation History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <DesignationHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
