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
import type { SubDepartmentFormFieldValues } from "../SubDepartmentForm";
import { SUB_DEPARTMENT_ROUTES } from "../../../../../../constants/routes/settings/sub-department/routes";

type AddSubDepartmentApiSuccessResponse = ApiSuccessResponse<SubDepartment>;

type UseAddSubDepartmentArgs = {
  options: UseMutationOptions<
    AddSubDepartmentApiSuccessResponse,
    ApiErrorResponse<SubDepartmentFormFieldValues>,
    Partial<SubDepartmentFormFieldValues>
  >;
};

export function useAddSubDepartment({ options = {} }: UseAddSubDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: subDepartmentKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddSubDepartmentApiSuccessResponse>(
          SUB_DEPARTMENT_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
