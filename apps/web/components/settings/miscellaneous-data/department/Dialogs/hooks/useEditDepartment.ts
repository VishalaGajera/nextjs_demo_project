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
import type { DepartmentFormFieldValues } from "../DepartmentForm";
import { DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/department/routes";

type EditDepartmentApiResponse = ApiSuccessResponse<Department>;

type UseEditDepartmentArgs = {
  options: UseMutationOptions<
    EditDepartmentApiResponse,
    ApiErrorResponse<DepartmentFormFieldValues>,
    Partial<DepartmentFormFieldValues>
  >;
  departmentId: string;
};

export function useEditDepartment({
  departmentId,
  options = {},
}: UseEditDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: departmentKeys.edit(departmentId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditDepartmentApiResponse>(
        DEPARTMENT_ROUTES.patch(departmentId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
