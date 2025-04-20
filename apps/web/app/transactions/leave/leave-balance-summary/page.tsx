"use client";

import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { LeaveBalanceSummaryBreadCrumbs } from "../../../../components/Transactions/Leave/LeaveBalanceSummary/LeaveBalanceSummaryBreadCrumbs";
import { LeaveBalanceSummaryFilter } from "../../../../components/Transactions/Leave/LeaveBalanceSummary/LeaveBalanceSummaryList/LeaveBalanceSummaryFilter";
import { LeaveBalanceSummaryList } from "../../../../components/Transactions/Leave/LeaveBalanceSummary/LeaveBalanceSummaryList/LeaveBalanceSummaryList";
import { Debounce_Delay } from "../../../../utils/helper";

export type LeaveBalanceSummaryListRef = {
  refreshLeaveBalanceSummaryist: () => void;
};

export type LeaveBalanceSummaryFormValues = {
  search: string | null;
};

export default function Page() {
  const leaveBalanceSummaryListRef = useRef<LeaveBalanceSummaryListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue, slate } = theme.palette.app.color;

  const formMethods = useForm<LeaveBalanceSummaryFormValues>({
    defaultValues: {
      search: null,
    },
  });

  const { watch, control } = formMethods;

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  return (
    <Stack gap="10px">
      <LeaveBalanceSummaryBreadCrumbs />

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
              padding: "12px",
              paddingLeft: "10px",
            }}
          >
            <Typography variant="h6">Leave Balance</Typography>
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
            <Stack
              direction="row"
              gap="5px"
              justifyContent="flex-end"
              padding="10px"
            >
              <LeaveBalanceSummaryFilter
                filterListData={filterListData}
                setFilterListData={setFilterListData}
              />

              <SearchField name="search" control={control} />
            </Stack>

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
              <LeaveBalanceSummaryList
                ref={leaveBalanceSummaryListRef}
                externalFilter={filterListData}
                search={searchInput}
              />
            )}
          </Box>
        </FormProvider>
      </Stack>
    </Stack>
  );
}
