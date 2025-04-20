"use client";

import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AttendanceOverviewBreadCrumbs } from "../../../../components/Transactions/Attendance/AttendanceOverview/AttendanceOverviewBreadCrumbs";
import { AttendanceOverviewFilter } from "../../../../components/Transactions/Attendance/AttendanceOverview/AttendanceOverviewList/AttendanceOverviewFilter";
import { AttendanceOverviewList } from "../../../../components/Transactions/Attendance/AttendanceOverview/AttendanceOverviewList/AttendanceOverviewList";
import { Debounce_Delay } from "../../../../utils/helper";

export type AttendanceListRef = {
  refreshAttendanceList: () => void;
};

export default function Page() {
  const attendanceListRef = useRef<AttendanceListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: null,
    },
  });

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  return (
    <Stack gap="5px">
      <AttendanceOverviewBreadCrumbs />

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
          <Stack
            direction="row"
            gap="5px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Attendance Overview</Typography>
          </Stack>
        </PadBox>
      </Box>

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
            <AttendanceOverviewFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <SearchField name="search" control={control} />
          </Stack>
        </PadBox>
        <AttendanceOverviewList
          ref={attendanceListRef}
          externalFilter={filterListData}
          search={searchInput}
        />
      </Box>
    </Stack>
  );
}
