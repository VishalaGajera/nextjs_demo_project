"use client";

import { DatePicker, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { ShiftPlannerBreadcrumbs } from "../../../../components/Transactions/ShiftDay/ShiftPlanner/ShiftPlannerBreadcrumbs";
import { ShiftPlannerFilter } from "../../../../components/Transactions/ShiftDay/ShiftPlanner/ShiftPlannerList/ShiftPlannerFilter";
import { ShiftPlannerList } from "../../../../components/Transactions/ShiftDay/ShiftPlanner/ShiftPlannerList/ShiftPlannerList";
import { Debounce_Delay } from "../../../../utils/helper";

export default function Page() {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const [filterListData, setFilterListData] = useState<FieldValues | undefined>(
    undefined
  );

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
      datePeriod: DateTime.now().toFormat("yyyy-MM"),
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const [datePeriodInput] = useDebounceValue(
    DateTime.fromISO(
      watch("datePeriod").split("-").slice(0, 2).join("-")
    ).toFormat("yyyy-MM"),
    Debounce_Delay
  );

  return (
    <Stack gap="10px">
      <ShiftPlannerBreadcrumbs />
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
          <PadBox padding={{ padding: "10Px" }}>
            <Stack
              direction="row"
              gap="5px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Shift Planner</Typography>
              <DatePicker
                clearable={false}
                format="MMM yyyy"
                views={["year", "month"]}
                name="datePeriod"
                maxDate={DateTime.now().plus({ months: 3 })}
                control={control}
              />
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
              <ShiftPlannerFilter
                filterListData={filterListData}
                setFilterListData={setFilterListData}
              />
              <SearchField name="search" control={control} />
            </Stack>
          </PadBox>
          <ShiftPlannerList
            datePeriod={datePeriodInput}
            search={searchInput}
            externalFilter={filterListData}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
