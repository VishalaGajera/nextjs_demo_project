import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { Holiday } from "../HolidayList/hooks/useGetHolidays";
import { HolidayForm } from "./HolidayForm";
import { useGetHoliday } from "./hooks/useGetHoliday";

type ViewHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  holidayId: Holiday["id"];
};

export const ViewHolidayDialog = ({
  holidayId,
  open,
  onClose,
}: ViewHolidayDialogProps) => {
  const { data: latestHolidayData, isPending: isPendingLatestHolidayData } =
    useGetHoliday({
      holidayId,
    });

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
        defaultValues={latestHolidayData}
        loading={isPendingLatestHolidayData}
        disabled
      />
    </Dialog>
  );
};
