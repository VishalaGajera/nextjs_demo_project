import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import { HolidayForm } from "./HolidayForm";
import { useGetHoliday } from "./hooks/useGetHoliday";

type ViewHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  holidayGroupId: string;
  holidayId: string;
  year: string;
};

export const ViewHolidayDialog = ({
  open,
  onClose,
  holidayGroupId,
  holidayId,
  year,
}: ViewHolidayDialogProps) => {
  const { data: holidayData, isPending: isPendingHolidayData } = useGetHoliday({
    holidayId,
    holidayGroupId,
  });

  const defaultValues = useMemo(() => {
    if (holidayData) {
      const { holiday_date, holiday_name } = holidayData;

      return {
        holiday_date,
        holiday_name,
      };
    }
  }, [holidayData]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Holiday"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <HolidayForm
        defaultValues={defaultValues}
        loading={isPendingHolidayData}
        year={year}
        disabled
      />
    </Dialog>
  );
};
