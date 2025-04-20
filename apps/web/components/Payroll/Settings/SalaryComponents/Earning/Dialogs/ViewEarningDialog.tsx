import { Button, Dialog } from "@codezee/sixtify-brahma";
import { EarningForm } from "./EarningForm";
import { useGetEarning } from "./hooks/useGetEarning";

type ViewEarningDialogProps = {
  open: boolean;
  onClose: () => void;
  earningId: string;
};

export const ViewEarningDialog = ({
  open,
  onClose,
  earningId,
}: ViewEarningDialogProps) => {
  const { data: earningData, isPending: isPendingEarningData } = useGetEarning({
    earningId,
  });

  return (
    <Dialog
      title="View Earning"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <EarningForm
        defaultValues={earningData}
        loading={isPendingEarningData}
        dialogType="view"
      />
    </Dialog>
  );
};
