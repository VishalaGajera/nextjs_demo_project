import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useGetProvidentFund } from "./hooks/useGetProvidentFund";
import { ProvidentFundForm } from "./ProvidentFundForm";

type ViewProvidentFundDialogProps = {
  open: boolean;
  onClose: () => void;
  providentFundId: string;
};

export const ViewProvidentFundDialog = ({
  open,
  onClose,
  providentFundId,
}: ViewProvidentFundDialogProps) => {
  const { data: providentFundData, isPending: isPendingProvidentFundData } =
    useGetProvidentFund({
      providentFundId,
    });

  return (
    <Dialog
      title="View Provident Fund"
      maxWidth="lg"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <ProvidentFundForm
        defaultValues={providentFundData}
        loading={isPendingProvidentFundData}
        dialogType="view"
      />
    </Dialog>
  );
};
