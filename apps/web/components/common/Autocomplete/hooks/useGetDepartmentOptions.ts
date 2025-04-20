import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { departmentKeys } from "../../../../queryKeysFactories/department";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { DEPARTMENT_ROUTES } from "../../../../constants/routes/settings/department/routes";

type UseGetDepartmentArgs = {
  companyId?: string | null;
};

export function useGetDepartmentOptionsQueryFn({
  companyId,
}: UseGetDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDepartment = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      DEPARTMENT_ROUTES.options(companyId)
    );

    return data.data;
  };

  return { fetchDepartment };
}
export function useGetDepartmentOptions({ companyId }: UseGetDepartmentArgs) {
  const { fetchDepartment } = useGetDepartmentOptionsQueryFn({ companyId });

  return useQuery({
    queryKey: departmentKeys.options(companyId),
    queryFn: fetchDepartment,
    enabled: !!companyId,
    initialData: [],
  });
}
