"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { subDepartmentKeys } from "../../../../../../queryKeysFactories/subDepartment";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { SubDepartment } from "../../SubDepartmentList/hooks/useGetSubDepartments";
import { SUB_DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/sub-department/routes";

type DeleteSubDepartmentApiResponse = ApiSuccessResponse<SubDepartment>;

type UseDeleteSubDepartmentArgs = {
  options: UseMutationOptions<DeleteSubDepartmentApiResponse, ApiErrorResponse>;
  subDepartmentId: string;
};

export function useDeleteSubDepartment({
  subDepartmentId,
  options = {},
}: UseDeleteSubDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: subDepartmentKeys.delete(subDepartmentId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteSubDepartmentApiResponse>(
          SUB_DEPARTMENT_ROUTES.delete(subDepartmentId)
        );

      return data;
    },
    ...options,
  });
}
