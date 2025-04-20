import { Button, Dialog } from "@codezee/sixtify-brahma";
import { CompanyBankForm } from "./CompanyBankForm";
import { useGetCompanyBank } from "./hooks/useGetCompanyBank";

type ViewCompanyBankDialogProps = {
  open: boolean;
  onClose: () => void;
  companyBankId: string;
};

export const ViewCompanyBankDialog = ({
  companyBankId,
  open,
  onClose,
}: ViewCompanyBankDialogProps) => {
  const { data: companyBank, isPending: isPendingLatestCompanyBank } =
    useGetCompanyBank({
      companyBankId,
    });

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Company Bank"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <CompanyBankForm
        defaultValues={companyBank}
        loading={isPendingLatestCompanyBank}
        disabled
      />
    </Dialog>
  );
};
