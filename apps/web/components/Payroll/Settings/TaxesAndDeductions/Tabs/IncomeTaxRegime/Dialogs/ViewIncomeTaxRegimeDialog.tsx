import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import { IncomeTaxRegimeForm } from "../IncomeTaxRegimeForm";
import { useGetIncomeTaxRegime } from "../hooks/useGetIncomeTaxRegime";

type ViewIncomeTaxRegimeDialogProps = {
  open: boolean;
  onClose: () => void;
  incomeTaxRegimeId: string;
};

export const ViewIncomeTaxRegimeDialog = ({
  open,
  onClose,
  incomeTaxRegimeId,
}: ViewIncomeTaxRegimeDialogProps) => {
  const { data: incomeTaxRegime, isPending: isPendingIncomeTaxRegimeData } =
    useGetIncomeTaxRegime({
      incomeTaxRegimeId,
    });

  const defaultValues = useMemo(() => {
    return {
      ...incomeTaxRegime,
      financial_year: `${incomeTaxRegime?.financial_year.start_date} | ${incomeTaxRegime?.financial_year.end_date}`,
    };
  }, [incomeTaxRegime]);

  return (
    <Dialog
      title="View Income Tax Regime"
      maxWidth="xl"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <IncomeTaxRegimeForm
        defaultValues={defaultValues}
        loading={isPendingIncomeTaxRegimeData}
        disabled
      />
    </Dialog>
  );
};
