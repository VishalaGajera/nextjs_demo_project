import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { SubDepartmentHistoryList } from "./SubDepartmentHistoryList";

type SubDepartmentHistoryDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const SubDepartmentHistoryDialog = ({
  onClose,
  open,
  employeeId,
}: SubDepartmentHistoryDialogProps) => {
  return (
    <BottomDialog
      open={open}
      onClose={onClose}
      title="Sub Department History"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SubDepartmentHistoryList employeeId={employeeId} />
    </BottomDialog>
  );
};
