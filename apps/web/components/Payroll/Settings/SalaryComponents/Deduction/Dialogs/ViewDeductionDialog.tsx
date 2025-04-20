import { Button, Dialog } from "@codezee/sixtify-brahma";
import { SalaryComponentForm } from "../../SalaryComponentForm";
import { useGetDeduction } from "./hooks/useGetDeduction";

type ViewDeductionDialogProps = {
  open: boolean;
  onClose: () => void;
  deductionId: string;
};

export const ViewDeductionDialog = ({
  open,
  onClose,
  deductionId,
}: ViewDeductionDialogProps) => {
  const { data: deductionData, isPending: isPendingDeductionData } =
    useGetDeduction({
      deductionId,
    });

  return (
    <Dialog
      title="View Deduction"
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
        defaultValues={deductionData}
        loading={isPendingDeductionData}
        type="deduction"
        dialogType="view"
      />
    </Dialog>
  );
};
