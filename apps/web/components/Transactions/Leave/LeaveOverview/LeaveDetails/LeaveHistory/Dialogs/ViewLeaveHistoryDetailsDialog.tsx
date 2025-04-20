import { Button, Dialog } from "@codezee/sixtify-brahma";
import { LeaveRequestDetailsCard } from "../../PendingLeaveRequests/Dialogs/LeaveRequestDetailsCard";
import { useGetLeaveRequestHistory } from "./hooks/useGetLeaveRequestHistory";

type ViewLeaveHistoryDetailsDialogProps = {
  leaveRequestId: string;
  selectedEmployeeId: string;
  open: boolean;
  onClose: () => void;
};

export const ViewLeaveHistoryDetailsDialog = ({
  leaveRequestId,
  selectedEmployeeId,
  open,
  onClose,
}: ViewLeaveHistoryDetailsDialogProps) => {
  const { data: LeaveRequestDetails, isLoading: isLeaveRequestDetailsLoading } =
    useGetLeaveRequestHistory({
      leaveRequestId,
      employeeId: selectedEmployeeId,
    });

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
