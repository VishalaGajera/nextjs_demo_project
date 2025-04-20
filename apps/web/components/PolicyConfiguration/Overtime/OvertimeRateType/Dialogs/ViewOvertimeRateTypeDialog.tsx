import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useGetOvertimeRateType } from "./hooks/useGetOvertimeRateType";
import { OvertimeRateTypeForm } from "./OvertimeRateTypeForm";

type ViewOvertimeRateTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  overtimeRateTypeId: string;
};

export const ViewOvertimeRateTypeDialog = ({
  overtimeRateTypeId,
  open,
  onClose,
}: ViewOvertimeRateTypeDialogProps) => {
  const {
    data: latestOvertimeRateTypeData,
    isPending: isPendingOvertimeRateType,
  } = useGetOvertimeRateType({
    overtimeRateTypeId,
  });

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Overtime Rate Type"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <OvertimeRateTypeForm
        defaultValues={latestOvertimeRateTypeData}
        loading={isPendingOvertimeRateType}
        disabled
      />
    </Dialog>
  );
};
