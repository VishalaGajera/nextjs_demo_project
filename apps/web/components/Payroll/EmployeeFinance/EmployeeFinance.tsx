import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { Debounce_Delay } from "../../../utils/helper";
import { EmployeeFinanceFilter } from "./EmployeeFinanceList/EmployeeFinanceFilter";
import { EmployeeFinanceList } from "./EmployeeFinanceList/EmployeeFinanceList";
import { EmployeeFinanceListBreadcrumbs } from "./EmployeeFinanceListBreadcrumbs";

export type EmployeeFinanceListRef = {
  refreshEmployeeFinanceList: () => void;
  getSelectedEmployeeIds: () => void;
  clearSelection: () => void;
};

export type EmployeeFinanceFormValues = {
  search: string | null;
  selectedRecords: {
    [key: string]: boolean | null;
  } | null;
  checkAll: boolean;
};

export const EmployeeFinance = () => {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const formMethods = useForm<EmployeeFinanceFormValues>({
    defaultValues: {
      search: null,
    },
  });

  const { control, watch, setValue } = formMethods;

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const clearSelection = () => {
    setValue("selectedRecords", null);
  };

  return (
    <Stack gap="10px">
      <EmployeeFinanceListBreadcrumbs />

      <Box
        sx={{
          background: iron[600],
          border: `1px solid ${butterflyBlue[300]}`,
          borderRadius: "6px",
          height: "100%",
          width: "100%",
        }}
      >
        <PadBox
          padding={{
            padding: "12px 12px 12px 10px",
          }}
        >
          <Typography variant="h6">Employee Finance</Typography>
        </PadBox>
      </Box>

      <Stack gap="5px">
        <FormProvider {...formMethods}>
          <Stack
            sx={{
              background: iron[600],
              border: `1px solid ${butterflyBlue[300]}`,
              borderRadius: "6px",
              height: "100%",
              width: "100%",
              gap: "10px",
            }}
          >
            <PadBox padding={{ padding: "10px 10px 0 10px" }}>
              <Stack
                direction="row"
                gap="5px"
                justifyContent="flex-end"
                alignItems="center"
              >
                <EmployeeFinanceFilter
                  filterListData={filterListData}
                  setFilterListData={setFilterListData}
                  clearSelection={clearSelection}
                />

                <SearchField name="search" control={control} />
              </Stack>
            </PadBox>

            <EmployeeFinanceList
              search={searchInput}
              externalFilter={filterListData}
            />
          </Stack>
        </FormProvider>
      </Stack>
    </Stack>
  );
};
