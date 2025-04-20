import { Button, Dialog } from "@codezee/sixtify-brahma";
import { BankShiftForm } from "./BankShiftForm";
import { useGetBankShift } from "./hooks/useGetBankShift";

type ViewBankShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  bankshiftId: string;
};
export const ViewBankShiftDialog = ({
  bankshiftId,
  open,
  onClose,
}: ViewBankShiftDialogProps) => {
  const { data: latestBankShiftData, isPending: isPendingBankShiftData } =
    useGetBankShift({
      bankshiftId,
    });

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title="View Bank Shift"
      actions={
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <BankShiftForm
        defaultValues={latestBankShiftData}
        loading={isPendingBankShiftData}
        disabled
      />
    </Dialog>
  );
};
