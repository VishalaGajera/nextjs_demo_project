import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { subDepartmentKeys } from "../../../../../../queryKeysFactories/subDepartment";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { SubDepartment } from "../../SubDepartmentList/hooks/useGetSubDepartments";
import { SUB_DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/sub-department/routes";

type UseGetSubDepartmentArgs = {
  subDepartmentId: SubDepartment["id"];
};

export function useGetSubDepartment({
  subDepartmentId,
}: UseGetSubDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSubDepartment = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<
        Omit<SubDepartment, "sub_department_heads"> & {
          sub_department_heads: string[];
        }
      >
    >(SUB_DEPARTMENT_ROUTES.get(subDepartmentId));

    return data;
  };

  return useQuery({
    queryKey: subDepartmentKeys.get(subDepartmentId),
    queryFn: fetchSubDepartment,
    enabled: !!subDepartmentId,
  });
}
