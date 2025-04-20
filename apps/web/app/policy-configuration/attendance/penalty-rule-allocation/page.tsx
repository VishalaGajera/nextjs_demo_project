"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { UpdatePenaltyRulesAllocationDialog } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRulesAllocation/Dialogs/UpdatePenaltyRulesAllocationDialog";
import { PenaltyRulesAllocationBreadcrumbs } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRulesAllocation/PenaltyRulesAllocationBreadcrumbs";
import type { PenaltyRulesAllocationListType } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRulesAllocation/PenaltyRulesAllocationList/hooks/useGetPenaltyRulesAllocationList";
import { PenaltyRulesAllocationFilter } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRulesAllocation/PenaltyRulesAllocationList/PenaltyRulesAllocationFilter";
import { PenaltyRulesAllocationList } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRulesAllocation/PenaltyRulesAllocationList/PenaltyRulesAllocationList";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type penaltyRulesAllocationListRef = {
  refreshPenaltyRulesAllocationList: () => void;
  getSelectedEmployeeIds: () => void;
  clearSelection: () => void;
};

export type PenaltyRulesAllocationFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export default function Page() {
  const theme = useTheme();

  const { iron, butterflyBlue, slate } = theme.palette.app.color;

  const formMethods = useForm<PenaltyRulesAllocationFormValues>({
    defaultValues: {
      search: null,
      selectedRecords: null,
      checkAll: false,
    },
  });

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch, setValue } = formMethods;

  const [penaltyRulesList, setPenaltyRulesList] = useState<
    PenaltyRulesAllocationListType[]
  >([]);

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const penaltyRulesAllocationListRef =
    useRef<penaltyRulesAllocationListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setPenaltyRulesList([]);
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
      <UpdatePenaltyRulesAllocationDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          penaltyRulesAllocationListRef.current?.refreshPenaltyRulesAllocationList();
          penaltyRulesAllocationListRef.current?.clearSelection();
          clearSelection();
        }}
        companyId={filterListData?.company_id}
        employeeIds={employeeIds}
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <PenaltyRulesAllocationBreadcrumbs />
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
                <Typography variant="h6">
                  Attendance Penalty Rules Allocation
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("edit")}
                  disabled={!(employeeIds.length && filterListData?.company_id)}
                >
                  Update Attendance Penalty Rule
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
                  <PenaltyRulesAllocationFilter
                    filterListData={filterListData}
                    setFilterListData={setFilterListData}
                    clearSelection={clearSelection}
                  />
                  <SearchField name="search" control={control} />
                </Stack>
              </PadBox>{" "}
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
                <PenaltyRulesAllocationList
                  ref={penaltyRulesAllocationListRef}
                  search={searchInput}
                  externalFilter={filterListData}
                  checkAll={checkAll}
                  employeeIds={employeeIds}
                  penaltyRulesList={penaltyRulesList}
                  setPenaltyRulesList={setPenaltyRulesList}
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
