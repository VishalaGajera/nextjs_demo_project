"use client";

import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { LeaveOverviewBreadCrumbs } from "../../../../components/Transactions/Leave/LeaveOverview/LeaveOverviewBreadCrumbs";
import { LeaveOverviewFilter } from "../../../../components/Transactions/Leave/LeaveOverview/LeaveOverviewList/LeaveOverviewFilter";
import { LeaveOverviewList } from "../../../../components/Transactions/Leave/LeaveOverview/LeaveOverviewList/LeaveOverviewList";
import { Debounce_Delay } from "../../../../utils/helper";

export type LeaveListRef = {
  refreshLeaveList: () => void;
};

export default function Page() {
  const leaveListRef = useRef<LeaveListRef>(null);

  const theme = useTheme();

  const { control, watch } = useForm({
    defaultValues: {
      search: null,
    },
  });

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  return (
    <Stack gap="10px">
      <LeaveOverviewBreadCrumbs />
      <Stack gap="5px">
        <Box
          sx={{
            background: theme.palette.app.color.iron[600],
            border: `1px solid ${theme.palette.app.color.butterflyBlue[300]}`,
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
            <Stack
              direction="row"
              gap="5px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Leave Overview</Typography>
            </Stack>
          </PadBox>
        </Box>

        <Box
          sx={{
            background: theme.palette.app.color.iron[600],
            border: `1px solid ${theme.palette.app.color.butterflyBlue[300]}`,
            borderRadius: "6px",
            height: "100%",
            width: "100%",
            gap: "10px",
          }}
        >
          <PadBox padding={{ padding: "10px" }}>
            <Stack direction="row" gap="5px" justifyContent="flex-end">
              <LeaveOverviewFilter
                filterListData={filterListData}
                setFilterListData={setFilterListData}
              />

              <SearchField name="search" control={control} />
            </Stack>
          </PadBox>
          <LeaveOverviewList
            ref={leaveListRef}
            externalFilter={filterListData}
            search={searchInput}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
