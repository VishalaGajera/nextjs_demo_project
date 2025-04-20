import { useQuery } from "@tanstack/react-query";
import {
  EMPLOYEE_ROUTES,
  type QueryParams,
} from "../../../../constants/routes/employee-management/employee/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetEmployeeOptionArgs = {
  companyId: string;
  queryParams: QueryParams;
};
export type EmployeeOption = OptionsType & {
  avatar: string;
  mobile_no: string;
  address: string;
  employee_code: string;
  punch_code: string;
};

export function useGetEmployeeOptionsQueryFn({
  companyId,
  queryParams = {},
}: UseGetEmployeeOptionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeeOption[]>
    >(EMPLOYEE_ROUTES.options(companyId, queryParams));

    return data.data;
  };

  return { fetchEmployeeOption };
}

export function useGetEmployeeOption({
  companyId,
  queryParams = {},
}: UseGetEmployeeOptionArgs) {
  const { fetchEmployeeOption } = useGetEmployeeOptionsQueryFn({
    companyId,
    queryParams,
  });

  return useQuery({
    queryKey: employeeKeys.options(companyId, queryParams),
    queryFn: fetchEmployeeOption,
    enabled: !!companyId,
    initialData: [],
  });
}
