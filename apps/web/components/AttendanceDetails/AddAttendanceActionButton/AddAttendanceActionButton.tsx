"use client";

import { Button } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useQueryClient } from "@tanstack/react-query";
import { useDialogActions } from "../../../hooks/useDialogActions";
import { attendanceDetailsKey } from "../../../queryKeysFactories/attendanceView";
import type { DialogRenderer } from "../../../types/dialogs";
import { AddAttendanceDialog } from "../../Transactions/Attendance/AttendanceOverview/Dialogs/AddAttendanceDialog";

type AddAttendanceActionButtonProps = {
  employeeId: string;
  date: string;
  joiningData: string;
};

export function AddAttendanceActionButton({
  employeeId,
  date,
  joiningData,
}: Readonly<AddAttendanceActionButtonProps>) {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddAttendanceDialog
        onClose={onDialogClose}
        open
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: attendanceDetailsKey.get(employeeId, date),
          });
        }}
        employeeId={employeeId}
        joiningData={joiningData}
      />
    ),
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => onDialogOpen("add")}
        startIcon={<AddRoundedIcon />}
      >
        Add Attendance Logs
      </Button>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
