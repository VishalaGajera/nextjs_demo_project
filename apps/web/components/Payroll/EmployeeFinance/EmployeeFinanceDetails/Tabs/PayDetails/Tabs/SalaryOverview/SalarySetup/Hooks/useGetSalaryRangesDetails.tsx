import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../../queryKeysFactories/SalaryStructure";
import type { ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import { type SalaryIntervals } from "../../../../../../../../Settings/SalaryStructure/SalaryStructureDetails/RangeBasedSalaryStructure/Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";

export type UseGetSalaryRangesDetailsArgs = {
  ssId: string;
  rangeId: string;
  interval: SalaryIntervals;
};

export type CalculationType = "percentage" | "fixed" | "adjustment";

export type SalaryDetail = {
  component_name: string;
  component_code: string;
  is_taxable: boolean;
  recurring: boolean;
};

export type SalaryRangeDetails = {
  id: string;
  calculation_type: CalculationType;
  fixed_amount: number | null;
  percentage_value: number | null;
  depends_on_salary_component_id: string | null;
  depends_on_salary_component: SalaryDetail | null;
  salary_component_id: string;
  salary_component: SalaryDetail;
};

export function useGetSalaryRangesDetails({
  ssId,
  rangeId,
  interval,
}: UseGetSalaryRangesDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useQuery({
    queryKey: salaryStructureKeys.getSalaryRangesDetails(
      ssId,
      rangeId,
      interval
    ),
    queryFn: async () => {
      const { data } = await axiosPrivate.get<
        ApiSuccessResponse<SalaryRangeDetails[]>
      >(
        SALARY_STRUCTURE_ROUTES.getSalaryComponentList(ssId, interval, rangeId)
      );

      return data;
    },
    enabled: !!ssId && !!rangeId && !!interval,
  });
}
