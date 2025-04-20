import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { Bank } from "../BankList/hooks/useGetBanks";
import { BankForm } from "./BankForm";
import { useGetBank } from "./hooks/useGetBank";

type ViewBankDialogProps = {
  open: boolean;
  onClose: () => void;
  bankId: Bank["id"];
};

export const ViewBankDialog = ({
  bankId,
  open,
  onClose,
}: ViewBankDialogProps) => {
  const { data: bank, isPending: isPendingBankData } = useGetBank({
    bankId,
  });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Bank"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <BankForm defaultValues={bank} loading={isPendingBankData} disabled />
    </Dialog>
  );
};
