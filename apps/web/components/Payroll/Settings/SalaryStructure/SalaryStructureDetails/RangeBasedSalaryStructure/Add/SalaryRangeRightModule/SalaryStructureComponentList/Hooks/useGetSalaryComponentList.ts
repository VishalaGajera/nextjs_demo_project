"use client";

import { useQuery } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../../queryKeysFactories/SalaryStructure";
import { type ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import { type CalculationType } from "../../../../../CustomBasedSalaryStructure/Edit/hook/useGetCustomSalaryStructureById";

export type SalaryComponentListType = {
  id: string;
  earning_component_type: CalculationType;
  earning_component_name: string;
  earning_component_code: string;
  is_taxable: boolean;
  max_limit_per_year: number | null;
  selected: boolean;
};

export type GetSalaryComponentsListApiResponse = ApiSuccessResponse<
  SalaryComponentListType[]
>;

export type SalaryComponentIntervals =
  | "monthly"
  | "annually"
  | "daily"
  | "hourly";

export const useSalaryStructureComponentListQueryFn = () => {
  const { axiosPrivate } = useAxiosPrivate();

  const getSalaryComponentsList = async () => {
    const { data } = await axiosPrivate.get<GetSalaryComponentsListApiResponse>(
      SALARY_STRUCTURE_ROUTES.getEarningComponentList()
    );

    return data;
  };

  return { getSalaryComponentsList };
};

export const useGetSalaryStructureComponentList = () => {
  const { getSalaryComponentsList } = useSalaryStructureComponentListQueryFn();

  return useQuery({
    queryKey: salaryStructureKeys.getEarningComponentList(),
    queryFn: async () => await getSalaryComponentsList(),
    initialData: { data: [], message: "" },
  });
};
