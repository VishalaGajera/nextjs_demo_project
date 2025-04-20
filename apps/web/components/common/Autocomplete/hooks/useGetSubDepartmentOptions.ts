import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { subDepartmentKeys } from "../../../../queryKeysFactories/subDepartment";
import { SUB_DEPARTMENT_ROUTES } from "../../../../constants/routes/settings/sub-department/routes";

type UseGetSubDepartmentArgs = {
  departmentId?: string | null;
};

export function useGetSubDepartmentOptions({
  departmentId,
}: UseGetSubDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSubDepartment = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      SUB_DEPARTMENT_ROUTES.options(departmentId)
    );

    return data?.data;
  };

  return useQuery({
    queryKey: subDepartmentKeys.options(departmentId),
    queryFn: fetchSubDepartment,
    enabled: !!departmentId,
    initialData: [],
  });
}
