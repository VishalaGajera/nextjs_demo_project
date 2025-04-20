import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import { BankHolidayForm } from "./BankHolidayForm";
import { useGetBankHoliday } from "./hooks/useGetBankHoliday";

type ViewBankHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  bankHolidayId: string;
  year: string;
};

export const ViewBankHolidayDialog = ({
  open,
  onClose,
  companyId,
  bankHolidayId,
  year,
}: ViewBankHolidayDialogProps) => {
  const { data: bankHolidayData, isPending: isPendingBankHolidayData } =
    useGetBankHoliday({
      bankHolidayId,
      companyId,
    });

  const defaultValues = useMemo(() => {
    if (bankHolidayData) {
      return {
        holiday_date: bankHolidayData.holiday_date,
        holiday_name: bankHolidayData.holiday_name,
      };
    }
  }, [bankHolidayData]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Bank Holiday"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <BankHolidayForm
        defaultValues={defaultValues}
        loading={isPendingBankHolidayData}
        year={year}
        disabled
      />
    </Dialog>
  );
};
