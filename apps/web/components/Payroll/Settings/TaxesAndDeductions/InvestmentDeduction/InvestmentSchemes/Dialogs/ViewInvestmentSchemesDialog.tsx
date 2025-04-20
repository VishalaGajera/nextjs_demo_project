import { Button, Dialog } from "@codezee/sixtify-brahma";
import { InvestmentSchemesForm } from "./InvestmentSchemesForm";
import { useGetInvestmentSchemes } from "./hooks/useGetInvestmentSchemes";

type ViewInvestmentSchemesDialogProps = {
  open: boolean;
  onClose: () => void;
  investmentSchemesId: string;
};

export const ViewInvestmentSchemesDialog = ({
  open,
  onClose,
  investmentSchemesId,
}: ViewInvestmentSchemesDialogProps) => {
  const {
    data: investmentSchemesData,
    isPending: isPendingInvestmentSchemesData,
  } = useGetInvestmentSchemes({ investmentSchemesId });

  return (
    <Dialog
      title="View Investment Schemes"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <InvestmentSchemesForm
        defaultValues={investmentSchemesData}
        loading={isPendingInvestmentSchemesData}
        disabled
      />
    </Dialog>
  );
};
