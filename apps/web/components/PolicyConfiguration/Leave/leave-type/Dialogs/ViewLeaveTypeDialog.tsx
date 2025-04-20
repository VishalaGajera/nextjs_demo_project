import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useGetLeaveType } from "./hooks/useGetLeaveType";
import { LeaveTypeForm } from "./LeaveTypeForm";

type ViewLeaveTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  leaveTypeId: string;
};
export const ViewLeaveTypeDialog = ({
  leaveTypeId,
  open,
  onClose,
}: ViewLeaveTypeDialogProps) => {
  const { data: latestLeaveTypeData, isPending: isPendingLeaveTypeData } =
    useGetLeaveType({
      leaveTypeId,
    });

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="View Leave Type"
      actions={
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <LeaveTypeForm
        defaultValues={latestLeaveTypeData}
        loading={isPendingLeaveTypeData}
        disabled
      />
    </Dialog>
  );
};
