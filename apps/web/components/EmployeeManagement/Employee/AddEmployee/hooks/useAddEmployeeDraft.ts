"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeDraftKeys } from "../../../../../queryKeysFactories/employeeDraft";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { EmployeeDetail } from "../../EditEmployee/hooks/useGetEmployeeDraft";
import type { EmployeeFormFieldValues } from "../EmployeeForm";
import { EMPLOYEE_DRAFT_ROUTES } from "../../../../../constants/routes/employee-management/employee/draft/routes";

type AddEmployeeDraftApiSuccessResponse = ApiSuccessResponse<EmployeeDetail>;

type UseAddEmployeeDraftArgs = {
  options: UseMutationOptions<
    AddEmployeeDraftApiSuccessResponse,
    ApiErrorResponse<Record<string, string>>,
    Partial<EmployeeFormFieldValues>
  >;
};

export function useAddEmployeeDraft({ options = {} }: UseAddEmployeeDraftArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeDraftKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddEmployeeDraftApiSuccessResponse>(
          EMPLOYEE_DRAFT_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
