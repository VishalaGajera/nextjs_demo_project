import { Stack } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import {
  type SalaryIntervals,
  useGetSalaryRangeList,
} from "../Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import { SalaryRangeSidebar } from "../Add/SalaryRangeSideBar/SalaryRangeSideBar";
import { RangeBasedSalaryStructureListRightModule } from "./RangeBasedSalaryStructureListRightModule/RangeBasedSalaryStructureListRightModule";

export const RangeBasedSalaryStructureList = () => {
  const params = useParams();

  const ssId = params.ssId as string;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") as SalaryIntervals;

  const { data: salaryRanges = [], isFetching } = useGetSalaryRangeList({
    ssId,
    interval,
  });

  return (
    <Stack direction="row" gap="15px" sx={{ flex: 1 }}>
      {salaryRanges?.length > 0 ? (
        <>
          <SalaryRangeSidebar
            interval={interval}
            ssId={ssId}
            type="list"
            salaryRanges={salaryRanges}
            isLoading={isFetching}
          />

          <RangeBasedSalaryStructureListRightModule
            interval={interval}
            ssId={ssId}
            salaryRanges={salaryRanges}
            isLoading={isFetching}
          />
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
};
