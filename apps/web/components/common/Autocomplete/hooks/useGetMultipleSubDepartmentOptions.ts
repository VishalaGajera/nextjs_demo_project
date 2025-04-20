import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { subDepartmentKeys } from "../../../../queryKeysFactories/subDepartment";
import { SUB_DEPARTMENT_ROUTES } from "../../../../constants/routes/settings/sub-department/routes";

type UseGetMultipleSubDepartmentOptionsArgs = {
  departmentIds?: string[];
};

export function useGetMultipleSubDepartmentOptions({
  departmentIds,
}: UseGetMultipleSubDepartmentOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSubDepartment = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      SUB_DEPARTMENT_ROUTES.multipleOptions,
      { department_ids: departmentIds }
    );

    return data?.data;
  };

  return useQuery({
    queryKey: subDepartmentKeys.multipleOptions(departmentIds),
    queryFn: fetchSubDepartment,
    enabled: !!(Array.isArray(departmentIds) && departmentIds.length),
    initialData: [],
  });
}
