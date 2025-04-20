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

type AddDepartmentApiSuccessResponse = ApiSuccessResponse<Department>;

type UseAddDepartmentArgs = {
  options: UseMutationOptions<
    AddDepartmentApiSuccessResponse,
    ApiErrorResponse<DepartmentFormFieldValues>,
    Partial<DepartmentFormFieldValues>
  >;
};

export function useAddDepartment({ options = {} }: UseAddDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: departmentKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddDepartmentApiSuccessResponse>(
        DEPARTMENT_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
