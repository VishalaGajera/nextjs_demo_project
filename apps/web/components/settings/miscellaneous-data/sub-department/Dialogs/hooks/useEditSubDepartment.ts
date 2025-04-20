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

type EditSubDepartmentApiResponse = ApiSuccessResponse<SubDepartment>;

type UseEditSubDepartmentArgs = {
  options: UseMutationOptions<
    EditSubDepartmentApiResponse,
    ApiErrorResponse<SubDepartmentFormFieldValues>,
    Partial<SubDepartmentFormFieldValues>
  >;
  subDepartmentId: string;
};

export function useEditSubDepartment({
  subDepartmentId,
  options = {},
}: UseEditSubDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: subDepartmentKeys.edit(subDepartmentId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditSubDepartmentApiResponse>(
        SUB_DEPARTMENT_ROUTES.patch(subDepartmentId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
