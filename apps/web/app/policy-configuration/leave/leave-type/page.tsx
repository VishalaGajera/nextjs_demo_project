"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddLeaveTypeDialog } from "../../../../components/PolicyConfiguration/Leave/leave-type/Dialogs/AddLeaveTypeDialog";
import { LeaveTypeBreadcrumbs } from "../../../../components/PolicyConfiguration/Leave/leave-type/LeavetypeBreadcrumbs";
import { LeaveTypeList } from "../../../../components/PolicyConfiguration/Leave/leave-type/LeaveTypeList/LeaveTypeList";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type LeaveTypeListRef = {
  refreshLeaveTypeList: () => void;
};

export default function Page() {
  const leaveTypeListRef = useRef<LeaveTypeListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddLeaveTypeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => leaveTypeListRef.current?.refreshLeaveTypeList()}
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <LeaveTypeBreadcrumbs />

        <Box
          sx={{
            background: iron[600],
            border: `1px solid ${butterflyBlue[300]}`,
            borderRadius: "6px",
            height: "100%",
            width: "100%",
          }}
        >
          <PadBox padding={{ padding: "10px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Leave Type</Typography>

              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Leave Type
                </Button>
              </Stack>
            </Stack>
          </PadBox>

          <LeaveTypeList ref={leaveTypeListRef} search={searchInput} />
        </Box>
      </Stack>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
