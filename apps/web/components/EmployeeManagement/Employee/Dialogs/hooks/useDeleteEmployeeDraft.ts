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
import { EMPLOYEE_DRAFT_ROUTES } from "../../../../../constants/routes/employee-management/employee/draft/routes";

type DeleteEmployeeDraftApiResponse = ApiSuccessResponse<EmployeeDetail>;

type UseDeleteEmployeeDraftArgs = {
  options: UseMutationOptions<DeleteEmployeeDraftApiResponse, ApiErrorResponse>;
  employeeId: string;
};

export function useDeleteEmployeeDraft({
  employeeId,
  options = {},
}: UseDeleteEmployeeDraftArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeDraftKeys.delete(employeeId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteEmployeeDraftApiResponse>(
          EMPLOYEE_DRAFT_ROUTES.deleteDraft(employeeId)
        );

      return data;
    },
    ...options,
  });
}
