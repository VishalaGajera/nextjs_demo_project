import { useQuery } from "@tanstack/react-query";
import {
  EMPLOYEE_ROUTES,
  type QueryParams,
} from "../../../../constants/routes/employee-management/employee/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetEmployeeOptionWithoutCompanyArgs = {
  queryParams: QueryParams;
};

export type EmployeeOption = OptionsType & {
  avatar: string;
  mobile_no: string;
  address: string;
  employee_code: string;
  punch_code: string;
};

export function useGetEmployeeOptionWithoutCompanyQueryFn({
  queryParams = {},
}: UseGetEmployeeOptionWithoutCompanyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeeOption[]>
    >(EMPLOYEE_ROUTES.optionsWithoutCompany(queryParams));

    return data.data;
  };

  return { fetchEmployeeOption };
}

export function useGetEmployeeOptionWithoutCompany({
  queryParams = {},
}: UseGetEmployeeOptionWithoutCompanyArgs) {
  const { fetchEmployeeOption } = useGetEmployeeOptionWithoutCompanyQueryFn({
    queryParams,
  });

  return useQuery({
    queryKey: employeeKeys.optionsWithoutCompany(queryParams),
    queryFn: fetchEmployeeOption,
    initialData: [],
  });
}
