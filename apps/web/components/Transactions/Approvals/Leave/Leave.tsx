"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { ApproveBulkLeaveDialog } from "./Dialog/ApproveBulkLeaveDialog";
import { RejectBulkLeaveDialog } from "./Dialog/RejectBulkLeaveDialog";
import { LeaveFilter } from "./LeaveList/hooks/LeaveFilter";
import type { LeaveType } from "./LeaveList/hooks/useGetLeaveList";
import { LeaveList } from "./LeaveList/LeaveList";
import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";

export type LeaveListRef = {
  refreshLeaveList: () => void;
  getSelectedLeaveRequestIds: () => void;
  clearSelection: () => void;
};

export type LeaveFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export function Leave() {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const formMethods = useForm<LeaveFormValues>({
    defaultValues: {
      search: null,
      selectedRecords: null,
      checkAll: false,
    },
  });

  const { control, watch, setValue } = formMethods;

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const [combinedData, setCombinedData] = useState<LeaveType[]>([]);

  const leaveListRef = useRef<LeaveListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setCombinedData([]);
  };

  const leaveRequestIds = useMemo(() => {
    return (
      Object.entries(selectedRecords ?? {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value === true)
        .map(([key]) => key) || []
    );
  }, [Object.values(selectedRecords || {})]);

  const dialogRenderer: DialogRenderer = {
    approve: (
      <ApproveBulkLeaveDialog
        open
        onClose={onDialogClose}
        onApproveSuccess={() => {
          leaveListRef.current?.refreshLeaveList();
          leaveListRef.current?.clearSelection();
          clearSelection();
        }}
        leaveRequestIds={leaveRequestIds}
      />
    ),

    reject: (
      <RejectBulkLeaveDialog
        open
        onClose={onDialogClose}
        onRejectSuccess={() => {
          leaveListRef.current?.refreshLeaveList();
          leaveListRef.current?.clearSelection();
          clearSelection();
        }}
        leaveRequestIds={leaveRequestIds}
      />
    ),
  };

  return (
    <>
      <Stack gap="5px">
        <Box
          sx={{
            background: iron[600],
            border: `1px solid ${butterflyBlue[300]}`,
            borderRadius: "6px",
            height: "100%",
            width: "100%",
            gap: "10px",
          }}
        >
          <PadBox
            padding={{
              padding: "8px",
              paddingLeft: "10px",
            }}
          >
            <Stack
              direction="row"
              gap="5px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Leave</Typography>

              <Stack direction="row" gap="5px" alignItems="center">
                <Button
                  variant="contained"
                  onClick={() => onDialogOpen("approve")}
                  disabled={!leaveRequestIds.length}
                >
                  Approve
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("reject")}
                  disabled={!leaveRequestIds.length}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </PadBox>
        </Box>

        <FormProvider {...formMethods}>
          <Box
            sx={{
              background: iron[600],
              border: `1px solid ${butterflyBlue[300]}`,
              borderRadius: "6px",
              height: "100%",
              width: "100%",
              gap: "10px",
            }}
          >
            <PadBox padding={{ padding: "10px" }}>
              <Stack direction="row" justifyContent="flex-end">
                <LeaveFilter
                  filterListData={filterListData}
                  setFilterListData={setFilterListData}
                  setCombinedData={setCombinedData}
                  clearSelection={clearSelection}
                />

                <SearchField name="search" control={control} />
              </Stack>
            </PadBox>

            <LeaveList
              leaveRequestIds={leaveRequestIds}
              ref={leaveListRef}
              search={searchInput}
              checkAll={checkAll}
              externalFilter={filterListData}
              combinedData={combinedData}
              setCombinedData={setCombinedData}
              clearSelection={clearSelection}
            />
          </Box>
        </FormProvider>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
