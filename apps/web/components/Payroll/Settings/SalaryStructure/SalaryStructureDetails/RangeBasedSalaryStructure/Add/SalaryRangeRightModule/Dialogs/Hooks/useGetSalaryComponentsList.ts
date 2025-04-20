"use client";

import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../../queryKeysFactories/SalaryStructure";
import { type ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";

type SalaryComponent = {
  component_name: string;
  component_code: string;
  is_taxable: boolean;
  recurring: boolean;
};

export type SalaryStructureComponent = {
  id: string;
  calculation_type: "adjustment" | "percentage" | "fixed";
  fixed_amount: number | null;
  percentage_value: number | null;
  depends_on_salary_component_id: string | null;
  depends_on_salary_component: SalaryComponent;
  salary_component_id: string;
  salary_component: SalaryComponent;
  selected: boolean;
};

export type GetSalaryComponentsListApiResponse = ApiSuccessResponse<
  SalaryStructureComponent[]
>;

export type SalaryIntervals = "monthly" | "annually" | "daily" | "hourly";

export type UseGetSalaryComponentsListProps = {
  ssId: string;
  interval: SalaryIntervals;
  salaryRangeId: string;
};

export function useGetSalaryComponentsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getSalaryComponentsList = async ({
    ssId,
    interval,
    salaryRangeId,
  }: UseGetSalaryComponentsListProps) => {
    const { data } = await axiosPrivate.get<GetSalaryComponentsListApiResponse>(
      SALARY_STRUCTURE_ROUTES.getSalaryComponentList(
        ssId,
        interval,
        salaryRangeId
      )
    );

    return data.data;
  };

  return { getSalaryComponentsList };
}

export const useGetSalaryComponentsList = ({
  ssId,
  interval,
  salaryRangeId,
}: UseGetSalaryComponentsListProps) => {
  const { getSalaryComponentsList } = useGetSalaryComponentsQueryFn();

  return useQuery({
    queryKey: salaryStructureKeys.getSalaryComponentsList(
      ssId,
      interval,
      salaryRangeId
    ),
    queryFn: async () =>
      await getSalaryComponentsList({ interval, salaryRangeId, ssId }),
    enabled: !!salaryRangeId && !!ssId && !!interval,
    initialData: [],
  });
};
