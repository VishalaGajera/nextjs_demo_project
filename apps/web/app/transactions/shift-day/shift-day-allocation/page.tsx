"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { UpdateHolidayAllocationDialog } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/Dialogs/Holiday/UpdateHolidayDialog";
import { UpdateShiftAllocationDialog } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/Dialogs/Shift/UpdateShiftDialog";
import { UpdateWeeklyOffAllocationDialog } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/Dialogs/WeeklyOff/UpdateWeeklyOffDialog";
import { ShiftdayAllocationBreadcrumbs } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/ShiftdayAllocationBreadcrumbs";
import type { ShiftDayType } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/ShiftDayList/hooks/useGetShiftDayList";
import { ShiftAllocationFilter } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/ShiftDayList/ShiftAllocationFilter";
import { ShiftDayList } from "../../../../components/Transactions/ShiftDay/ShiftdayAllocation/ShiftDayList/ShiftDayList";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type shiftDayListRef = {
  refreshShiftDayList: () => void;
  getSelectedEmployeeIds: () => void;
  clearSelection: () => void;
};

export type ShiftDayFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export default function Page() {
  const theme = useTheme();

  const { iron, butterflyBlue, slate } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const formMethods = useForm<ShiftDayFormValues>({
    defaultValues: {
      search: null,
      selectedRecords: null,
      checkAll: false,
    },
  });

  const { control, watch, setValue } = formMethods;

  const [filterListData, setFilterListData] = useState<FieldValues | undefined>(
    undefined
  );

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const [combinedData, setCombinedData] = useState<ShiftDayType[]>([]);

  const shiftDayListRef = useRef<shiftDayListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setCombinedData([]);
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
    updateShift: (
      <UpdateShiftAllocationDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          shiftDayListRef.current?.refreshShiftDayList();
          shiftDayListRef.current?.clearSelection();
          clearSelection();
        }}
        employeeIds={employeeIds}
        companyId={filterListData?.company_id}
      />
    ),
    updateWeeklyOff: (
      <UpdateWeeklyOffAllocationDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          shiftDayListRef.current?.refreshShiftDayList();
          shiftDayListRef.current?.clearSelection();
          clearSelection();
        }}
        employeeIds={employeeIds}
        companyId={filterListData?.company_id}
      />
    ),
    updateHoliday: (
      <UpdateHolidayAllocationDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          shiftDayListRef.current?.refreshShiftDayList();
          shiftDayListRef.current?.clearSelection();
          clearSelection();
        }}
        employeeIds={employeeIds}
        companyId={filterListData?.company_id}
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <ShiftdayAllocationBreadcrumbs />
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
                <Typography variant="h6">Shift & Day Allocation</Typography>
                <Stack direction="row" gap="5px">
                  <Button
                    variant="outlined"
                    onClick={() => onDialogOpen("updateShift")}
                    disabled={
                      !(employeeIds.length && filterListData?.company_id)
                    }
                  >
                    Update Shift
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => onDialogOpen("updateWeeklyOff")}
                    disabled={
                      !(employeeIds.length && filterListData?.company_id)
                    }
                  >
                    Update Weekly Off
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => onDialogOpen("updateHoliday")}
                    disabled={
                      !(employeeIds.length && filterListData?.company_id)
                    }
                  >
                    Update Holiday
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
                  <ShiftAllocationFilter
                    filterListData={filterListData}
                    setFilterListData={setFilterListData}
                    setCombinedData={setCombinedData}
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
                <ShiftDayList
                  employeeIds={employeeIds}
                  ref={shiftDayListRef}
                  search={searchInput}
                  checkAll={checkAll}
                  externalFilter={filterListData}
                  combinedData={combinedData}
                  setCombinedData={setCombinedData}
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
