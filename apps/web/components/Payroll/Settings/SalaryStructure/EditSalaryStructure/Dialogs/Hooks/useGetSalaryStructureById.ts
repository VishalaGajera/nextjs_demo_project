"use client";

import { useQuery } from "@tanstack/react-query";

import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryStructureType } from "../../../AddSalaryStructure/SalaryStructureForm";

export type SalaryStructureApiResponse = ApiSuccessResponse<
  SalaryStructureType & { id: string; company_name: string }
>;

export type UseGetSalaryStructureProps = {
  ssId: string;
};

export function useGetSalaryStructureById({
  ssId,
}: UseGetSalaryStructureProps) {
  const { axiosPrivate } = useAxiosPrivate();

  return useQuery({
    queryKey: salaryStructureKeys.get(ssId),
    queryFn: async () => {
      const { data } = await axiosPrivate.get<SalaryStructureApiResponse>(
        SALARY_STRUCTURE_ROUTES.get(ssId)
      );

      return data.data;
    },
    enabled: !!ssId,
  });
}
