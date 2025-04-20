"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeKeys } from "../../../../../queryKeysFactories/employee";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { EmployeeDetail } from "../../EditEmployee/hooks/useGetEmployeeDraft";
import type { EmployeeFormFieldValues } from "../EmployeeForm";
import { EMPLOYEE_ROUTES } from "../../../../../constants/routes/employee-management/employee/routes";

type AddEmployeeApiSuccessResponse = ApiSuccessResponse<EmployeeDetail>;

type UseAddEmployeeArgs = {
  options: UseMutationOptions<
    AddEmployeeApiSuccessResponse,
    ApiErrorResponse<Record<string, string>>,
    Partial<
      EmployeeFormFieldValues & {
        employee_draft_id?: string;
      }
    >
  >;
};

export function useAddEmployee({ options = {} }: UseAddEmployeeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddEmployeeApiSuccessResponse>(
        EMPLOYEE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
