"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { departmentKeys } from "../../../../../../queryKeysFactories/department";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Department } from "../../DepartmentList/hooks/useGetDepartments";
import { DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/department/routes";

type DeleteDepartmentApiResponse = ApiSuccessResponse<Department>;

type UseDeleteDepartmentArgs = {
  options: UseMutationOptions<DeleteDepartmentApiResponse, ApiErrorResponse>;
  departmentId: string;
};

export function useDeleteDepartment({
  departmentId,
  options = {},
}: UseDeleteDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: departmentKeys.delete(departmentId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteDepartmentApiResponse>(
        DEPARTMENT_ROUTES.delete(departmentId)
      );

      return data;
    },
    ...options,
  });
}
