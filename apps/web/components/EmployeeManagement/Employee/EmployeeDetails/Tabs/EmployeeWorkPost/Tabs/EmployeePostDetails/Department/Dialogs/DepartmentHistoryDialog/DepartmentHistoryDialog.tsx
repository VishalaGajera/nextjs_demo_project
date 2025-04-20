import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { DepartmentHistoryList } from "./DepartmentHistoryList";

type DepartmentHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const DepartmentHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: DepartmentHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Department History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <DepartmentHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
