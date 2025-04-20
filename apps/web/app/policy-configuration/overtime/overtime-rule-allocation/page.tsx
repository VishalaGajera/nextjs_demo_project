"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { UpdateOvertimeRulesAllocationDialog } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRulesAllocation/Dialogs/UpdateOvertimeRulesAllocationDialog";
import type { OvertimeRulesAllocationListType } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRulesAllocation/OvertimeRulesAllocationList/Hooks/useGetOvertimeRulesAllocationList";
import { OvertimeRulesAllocationBreadcrumbs } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRulesAllocation/OvertimeRulesAllocationList/OvertimeRulesAllocationBreadcrumbs";
import { OvertimeRulesAllocationFilter } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRulesAllocation/OvertimeRulesAllocationList/OvertimeRulesAllocationFilter";
import { OvertimeRulesAllocationList } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRulesAllocation/OvertimeRulesAllocationList/OvertimeRulesAllocationList";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type overtimeRulesAllocationListRef = {
  refreshOvertimeRulesAllocationList: () => void;
  getSelectedEmployeeIds: () => void;
  clearSelection: () => void;
};

export type OvertimeRulesAllocationFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export default function Page() {
  const theme = useTheme();

  const { iron, butterflyBlue, slate } = theme.palette.app.color;

  const formMethods = useForm<OvertimeRulesAllocationFormValues>({
    defaultValues: {
      search: null,
      selectedRecords: null,
      checkAll: false,
    },
  });

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch, setValue } = formMethods;

  const [overtimeRulesList, setOvertimeRulesList] = useState<
    OvertimeRulesAllocationListType[]
  >([]);

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const overtimeRulesAllocationListRef =
    useRef<overtimeRulesAllocationListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setOvertimeRulesList([]);
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
      <UpdateOvertimeRulesAllocationDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          overtimeRulesAllocationListRef.current?.refreshOvertimeRulesAllocationList();
          overtimeRulesAllocationListRef.current?.clearSelection();
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
        <OvertimeRulesAllocationBreadcrumbs />
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
                <Typography variant="h6">Overtime Rules Allocation</Typography>
                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("edit")}
                  disabled={!(employeeIds.length && filterListData?.company_id)}
                >
                  Update Overtime Rule
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
                  <OvertimeRulesAllocationFilter
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
                <OvertimeRulesAllocationList
                  checkAll={checkAll}
                  employeeIds={employeeIds}
                  overtimeRulesList={overtimeRulesList}
                  setOvertimeRulesList={setOvertimeRulesList}
                  ref={overtimeRulesAllocationListRef}
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
