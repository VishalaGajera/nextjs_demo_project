import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useGetLeaveRequest } from "./hooks/useGetPendingLeaveRequest";
import { LeaveRequestDetailsCard } from "./LeaveRequestDetailsCard";

type ViewPendingLeaveRequestDialogProps = {
  leaveRequestId: string;
  employeeId: string;
  open: boolean;
  onClose: () => void;
};

export const ViewPendingLeaveRequestDialog = ({
  leaveRequestId,
  employeeId,
  open,
  onClose,
}: ViewPendingLeaveRequestDialogProps) => {
  const { data: LeaveRequestDetails, isLoading: isLeaveRequestDetailsLoading } =
    useGetLeaveRequest({ leaveRequestId, employeeId });

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      title="View Leave Request"
      open={open}
      isHideDividers
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LeaveRequestDetailsCard
        LeaveRequestDetails={LeaveRequestDetails}
        isLeaveRequestDetailsLoading={isLeaveRequestDetailsLoading}
      />
    </Dialog>
  );
};
