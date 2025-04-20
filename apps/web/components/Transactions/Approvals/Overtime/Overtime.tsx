"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { ApproveBulkOvertimeDialog } from "./Dialog/ApproveBulkOvertimeDialog";
import { RejectBulkOvertimeDialog } from "./Dialog/RejectBulkOvertimeDialog";
import { OvertimeFilter } from "./OvertimeList/hooks/OvertimeFilter";
import type { OvertimeType } from "./OvertimeList/hooks/useGetOvertimeList";
import { OvertimeList } from "./OvertimeList/OvertimeList";

export type OvertimeListRef = {
  refreshOvertimeList: () => void;
  getSelectedOvertimeRequestIds: () => void;
  clearSelection: () => void;
};

export type OvertimeFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export function Overtime() {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const formMethods = useForm<OvertimeFormValues>({
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

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const [combinedData, setCombinedData] = useState<OvertimeType[]>([]);

  const overtimeListRef = useRef<OvertimeListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setCombinedData([]);
  };

  const overtimeRequestIds = useMemo(() => {
    return (
      Object.entries(selectedRecords ?? {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value === true)
        .map(([key]) => key) || []
    );
  }, [Object.values(selectedRecords || {})]);

  const dialogRenderer: DialogRenderer = {
    approve: (
      <ApproveBulkOvertimeDialog
        open
        onClose={onDialogClose}
        onApproveSuccess={() => {
          overtimeListRef.current?.refreshOvertimeList();
          overtimeListRef.current?.clearSelection();
          clearSelection();
        }}
        overtimeRequestIds={overtimeRequestIds}
      />
    ),

    reject: (
      <RejectBulkOvertimeDialog
        open
        onClose={onDialogClose}
        onRejectSuccess={() => {
          overtimeListRef.current?.refreshOvertimeList();
          overtimeListRef.current?.clearSelection();
          clearSelection();
        }}
        overtimeRequestIds={overtimeRequestIds}
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
              <Typography variant="h6">Overtime</Typography>

              <Stack direction="row" gap="5px" alignItems="center">
                <Button
                  variant="contained"
                  onClick={() => onDialogOpen("approve")}
                  disabled={!overtimeRequestIds.length}
                >
                  Approve
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("reject")}
                  disabled={!overtimeRequestIds.length}
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
                <OvertimeFilter
                  filterListData={filterListData}
                  setFilterListData={setFilterListData}
                  setCombinedData={setCombinedData}
                  clearSelection={clearSelection}
                />

                <SearchField name="search" control={control} />
              </Stack>
            </PadBox>

            <OvertimeList
              overtimeRequestIds={overtimeRequestIds}
              ref={overtimeListRef}
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
