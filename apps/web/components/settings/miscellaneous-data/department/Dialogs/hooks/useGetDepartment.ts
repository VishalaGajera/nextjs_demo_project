import { useQuery } from "@tanstack/react-query";
import { DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/department/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { departmentKeys } from "../../../../../../queryKeysFactories/department";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { Department } from "../../DepartmentList/hooks/useGetDepartments";

type UseGetDepartmentArgs = {
  departmentId: Department["id"];
};

export function useGetDepartment({ departmentId }: UseGetDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDepartment = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<
        Omit<Department, "department_heads"> & { department_heads: string[] }
      >
    >(DEPARTMENT_ROUTES.get(departmentId));

    return data;
  };

  return useQuery({
    queryKey: departmentKeys.get(departmentId),
    queryFn: fetchDepartment,
    enabled: !!departmentId,
  });
}
