import { useQuery } from "@tanstack/react-query";
import { DEPARTMENT_ROUTES } from "../../../../constants/routes/settings/department/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { departmentKeys } from "../../../../queryKeysFactories/department";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetDepartmentEmployeeOptionArgs = {
  departmentId: string;
};
export type DepartmentEmployeeOption = OptionsType & {
  avatar: string;
  mobile_no: string;
  address: string;
  employee_code: string;
  punch_code: string;
};

export function useGetDepartmentEmployeeOptionsQueryFn({
  departmentId,
}: UseGetDepartmentEmployeeOptionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDepartmentEmployeeOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<DepartmentEmployeeOption[]>
    >(DEPARTMENT_ROUTES.getDepartmentOptions(departmentId));

    return data.data;
  };

  return { fetchDepartmentEmployeeOption };
}

export function useGetDepartmentEmployeeOption({
  departmentId,
}: UseGetDepartmentEmployeeOptionArgs) {
  const { fetchDepartmentEmployeeOption } =
    useGetDepartmentEmployeeOptionsQueryFn({
      departmentId,
    });

  return useQuery({
    queryKey: departmentKeys.departmentOptions(departmentId),
    queryFn: fetchDepartmentEmployeeOption,
    enabled: !!departmentId,
    initialData: [],
  });
}
