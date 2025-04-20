"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import BulkAttendanceBreadcrumbs from "../../../../components/Transactions/Attendance/BulkAttendance/BulkAttendanceBreadcrumbs";
import { BulkAttendanceFilter } from "../../../../components/Transactions/Attendance/BulkAttendance/BulkAttendanceFilter";
import { BulkAttendanceList } from "../../../../components/Transactions/Attendance/BulkAttendance/BulkAttendanceList/BulkAttendanceList";
import type { BulkAttendanceType } from "../../../../components/Transactions/Attendance/BulkAttendance/BulkAttendanceList/hooks/useGetBulkAttendances";
import { UpdateBulkAttendanceDialog } from "../../../../components/Transactions/Attendance/BulkAttendance/Dialog/hooks/UpdateBulkAttendanceDialog";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type bulkAttendanceListRef = {
  refreshBulkAttendanceList: () => void;
  getSelectedEmployeeIds: () => void;
  clearSelection: () => void;
};

export type BulkAttendanceFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export default function Page() {
  const theme = useTheme();

  const { iron, butterflyBlue, slate } = theme.palette.app.color;

  const formMethods = useForm<BulkAttendanceFormValues>({
    defaultValues: {
      search: null,
      selectedRecords: null,
      checkAll: false,
    },
  });

  const { control, watch, setValue } = formMethods;

  const [allBulkAttendanceData, setAllBulkAttendanceData] = useState<
    BulkAttendanceType[]
  >([]);

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const bulkAttendanceListRef = useRef<bulkAttendanceListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setAllBulkAttendanceData([]);
  };

  const employeeIds = useMemo(() => {
    return (
      Object.entries(selectedRecords ?? {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value === true)
        .map(([key]) => key) || []
    );
  }, [Object.values(selectedRecords || {})]);

  const dialogRenderer: DialogRenderer = {
    edit: (
      <UpdateBulkAttendanceDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          bulkAttendanceListRef.current?.refreshBulkAttendanceList();
          bulkAttendanceListRef.current?.clearSelection();
          clearSelection();
        }}
        employeeIds={employeeIds}
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <BulkAttendanceBreadcrumbs />
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
                <Typography variant="h6">Bulk Attendance</Typography>
                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("edit")}
                  disabled={!(employeeIds.length && filterListData?.company_id)}
                >
                  Update Bulk Attendance
                </Button>
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
                <Stack direction="row" gap="5px" justifyContent="flex-end">
                  <BulkAttendanceFilter
                    filterListData={filterListData}
                    setFilterListData={setFilterListData}
                    clearSelection={clearSelection}
                  />
                  <SearchField name="search" control={control} />
                </Stack>
              </PadBox>
              {!filterListData?.company_id ? (
                <PadBox padding={{ padding: "10px" }}>
                  <Box
                    sx={{
                      backgroundColor: slate[700],
                      borderRadius: "5px",
                      textAlign: "center",
                      paddingY: "10px",
                    }}
                  >
                    To view and take action on the data, please select at least
                    one company from the filters on the right and click Apply.
                  </Box>
                </PadBox>
              ) : (
                <BulkAttendanceList
                  checkAll={checkAll}
                  employeeIds={employeeIds}
                  allBulkAttendanceData={allBulkAttendanceData}
                  setAllBulkAttendanceData={setAllBulkAttendanceData}
                  ref={bulkAttendanceListRef}
                  search={searchInput}
                  externalFilter={filterListData}
                />
              )}
            </Box>
          </FormProvider>
        </Stack>
      </Stack>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
