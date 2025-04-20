"use client";

import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { SalaryRangeType } from "../SalaryRangeForm";

export type GetSalaryRangeListApiResponse = ApiSuccessResponse<
  SalaryRangeType[]
>;

export type SalaryIntervals = "monthly" | "annually" | "daily" | "hourly";

export type UseGetSalaryRangeListArgs = {
  ssId: string;
  interval: SalaryIntervals;
};

export function useGetSalaryRangeList({
  ssId,
  interval,
}: UseGetSalaryRangeListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useQuery({
    queryKey: salaryStructureKeys.rangeList(ssId, interval),
    queryFn: async () => {
      const { data } = await axiosPrivate.get<GetSalaryRangeListApiResponse>(
        SALARY_STRUCTURE_ROUTES.getRangeList(ssId, interval)
      );

      return data.data;
    },
    enabled: !!ssId && !!interval,
    initialData: [],
  });
}
