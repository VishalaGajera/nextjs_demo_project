import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { capitalize } from "lodash";
import { useSearchParams } from "next/navigation";
import { SalaryStructureRightModule } from "./SalaryRangeRightModule/SalaryStructureRightModule";
import type { SalaryIntervals } from "./SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import { useGetSalaryRangeList } from "./SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import { SalaryRangeSidebar } from "./SalaryRangeSideBar/SalaryRangeSideBar";

export const AddRangeBasedSalaryStructure = ({ ssId }: { ssId: string }) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") as SalaryIntervals;

  const tab = searchParams.get("tab") ?? "";

  const list = searchParams.get("list") ?? "";

  const { data: salaryRanges = [], isFetching } = useGetSalaryRangeList({
    ssId,
    interval,
  });

  return (
    <>
      <Box bgcolor={iron[600]} borderRadius="4px">
        <PadBox padding={{ padding: "15px" }}>
          <Typography color={iron[400]} variant="h6">
            {tab ? "Edit" : "Add"} Range Based {capitalize(interval)} Salary
            Structure
          </Typography>
        </PadBox>
      </Box>

      <Stack direction="row" gap="25px" sx={{ flex: 1 }}>
        <SalaryRangeSidebar
          interval={interval}
          ssId={ssId}
          salaryRanges={salaryRanges}
          isLoading={isFetching}
        />

        <SalaryStructureRightModule
          interval={interval}
          list={list}
          ssId={ssId}
          isLoading={isFetching}
          salaryRanges={salaryRanges}
          salaryRangeId={tab}
        />
      </Stack>
    </>
  );
};
