import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import {
  BankShiftPatternForm,
  type BankShiftPatternFormFieldValues,
} from "./BankShiftPatternForm";
import { useGetBankShiftPattern } from "./hooks/useGetBankShiftPattern";

type ViewBankShiftPatternDialogProps = {
  open: boolean;
  onClose: () => void;
  bankShiftPatternId: string;
};

export const ViewBankShiftPatternDialog = ({
  bankShiftPatternId,
  open,
  onClose,
}: ViewBankShiftPatternDialogProps) => {
  const { data: bankShiftPattern, isPending: isPendingLatestBankShiftPattern } =
    useGetBankShiftPattern({
      bankShiftPatternId,
    });

  const defaultValues = useMemo(() => {
    if (bankShiftPattern) {
      const bankShiftPatternFormFieldValues: BankShiftPatternFormFieldValues = {
        ...bankShiftPattern,
        configurations: Array.isArray(bankShiftPattern.configurations)
          ? bankShiftPattern.configurations.map((config) =>
              typeof config === "string"
                ? { shift: config }
                : { shift: config?.shift ?? null }
            )
          : [],
      };

      return bankShiftPatternFormFieldValues;
    }
  }, [bankShiftPattern]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Bank Shift Pattern"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <BankShiftPatternForm
        defaultValues={defaultValues}
        loading={isPendingLatestBankShiftPattern}
        disabled
      />
    </Dialog>
  );
};
