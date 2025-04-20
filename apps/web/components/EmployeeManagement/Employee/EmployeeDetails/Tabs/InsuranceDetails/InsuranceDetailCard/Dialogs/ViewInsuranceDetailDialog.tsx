import { Button, Dialog } from "@codezee/sixtify-brahma";
import { InsuranceDetailForm } from "./InsuranceDetailForm";
import { useGetInsuranceDetail } from "./hooks/useGetInsuranceDetail";

type ViewInsuranceDetailDialogProps = {
  open: boolean;
  employeeId: string;
  onClose: () => void;
  insuranceDetailId: string;
};
export const ViewInsuranceDetailDialog = ({
  insuranceDetailId,
  employeeId,
  open,
  onClose,
}: ViewInsuranceDetailDialogProps) => {
  const { data: latestInsuranceData, isPending: isPendingInsuranceData } =
    useGetInsuranceDetail({
      employeeId,
      insuranceDetailId,
    });

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="View Insurance Details"
      actions={
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <InsuranceDetailForm
        defaultValues={latestInsuranceData}
        loading={isPendingInsuranceData}
        disabled
      />
    </Dialog>
  );
};
