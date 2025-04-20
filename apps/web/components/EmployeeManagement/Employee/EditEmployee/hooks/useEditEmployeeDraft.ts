"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeDraftKeys } from "../../../../../queryKeysFactories/employeeDraft";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { EmployeeFormFieldValues } from "../../AddEmployee/EmployeeForm";
import type { EmployeeDetail } from "./useGetEmployeeDraft";
import { EMPLOYEE_DRAFT_ROUTES } from "../../../../../constants/routes/employee-management/employee/draft/routes";

type EditEmployeeDraftApiResponse = ApiSuccessResponse<EmployeeDetail>;

type UseEditEmployeeDraftArgs = {
  options: UseMutationOptions<
    EditEmployeeDraftApiResponse,
    ApiErrorResponse<Record<string, string>>,
    Partial<EmployeeFormFieldValues>
  >;
  employeeId: string;
};

export function useEditEmployeeDraft({
  employeeId,
  options = {},
}: UseEditEmployeeDraftArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeDraftKeys.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditEmployeeDraftApiResponse>(
        EMPLOYEE_DRAFT_ROUTES.patch(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
