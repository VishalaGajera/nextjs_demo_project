import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { BankShiftAllocationList } from "./BankShiftAllocationList/BankShiftAllocationList";
import { BankShiftFilter } from "./BankShiftAllocationList/BankShiftFilter";
import type { BankShiftAllocationType } from "./BankShiftAllocationList/Hooks/useGetBankShiftAllocation";
import { UpdateBankShiftAllocationDialog } from "./Dialog/UpdateBankShiftAllocationDialog";

export type bankShiftDayListRef = {
  refreshBankShiftDayList: () => void;
  getSelectedEmployeeIds: () => void;
  clearSelection: () => void;
};

export type BankShiftAllocationFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export const BankShiftAllocationDetails = () => {
  const theme = useTheme();

  const { butterflyBlue, iron, slate } = theme.palette.app.color;

  const formMethods = useForm<BankShiftAllocationFormValues>({
    defaultValues: {
      search: null,
      selectedRecords: null,
      checkAll: false,
    },
  });

  const { control, watch, setValue } = formMethods;

  const [allBankShiftAllocationData, setAllBankShiftAllocationData] = useState<
    BankShiftAllocationType[]
  >([]);

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const bankshiftDayListRef = useRef<bankShiftDayListRef>(null);

  const checkAll = watch("checkAll");

  const selectedRecords = watch("selectedRecords");

  const clearSelection = () => {
    setValue("selectedRecords", null);
    setValue("checkAll", false);
    setAllBankShiftAllocationData([]);
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
      <UpdateBankShiftAllocationDialog
        open
        onClose={onDialogClose}
        onEditSuccess={() => {
          bankshiftDayListRef.current?.refreshBankShiftDayList();
          bankshiftDayListRef.current?.clearSelection();
          clearSelection();
        }}
        employeeIds={employeeIds}
        companyId={filterListData?.company_id}
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
              <Typography variant="h6">Bank Shift Allocation</Typography>

              <Button
                variant="outlined"
                onClick={() => onDialogOpen("edit")}
                disabled={!(employeeIds.length && filterListData?.company_id)}
              >
                Update Bank Shift & Weekly Off
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
                <BankShiftFilter
                  filterListData={filterListData}
                  setFilterListData={setFilterListData}
                  setAllBankShiftAllocationData={setAllBankShiftAllocationData}
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
              <BankShiftAllocationList
                checkAll={checkAll}
                allBankShiftAllocationData={allBankShiftAllocationData}
                setAllBankShiftAllocationData={setAllBankShiftAllocationData}
                ref={bankshiftDayListRef}
                search={searchInput}
                employeeIds={employeeIds}
                externalFilter={filterListData}
              />
            )}
          </Box>
        </FormProvider>
      </Stack>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
