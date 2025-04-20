import { Button, Dialog } from "@codezee/sixtify-brahma";
import { SalaryComponentForm } from "../../SalaryComponentForm";
import { useGetReimbursement } from "./hooks/useGetReimbursement";

type ViewReimbursementDialogProps = {
  open: boolean;
  onClose: () => void;
  reimbursementId: string;
};

export const ViewReimbursementDialog = ({
  open,
  onClose,
  reimbursementId,
}: ViewReimbursementDialogProps) => {
  const { data: reimbursementData, isPending: isPendingReimbursementData } =
    useGetReimbursement({
      reimbursementId,
    });

  return (
    <Dialog
      title="View Reimbursement"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SalaryComponentForm
        defaultValues={reimbursementData}
        loading={isPendingReimbursementData}
        dialogType="view"
        type="reimbursement"
      />
    </Dialog>
  );
};
