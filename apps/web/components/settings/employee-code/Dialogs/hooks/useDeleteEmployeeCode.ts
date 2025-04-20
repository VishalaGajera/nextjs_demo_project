"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeCodeKeys } from "../../../../../queryKeysFactories/employeeCode";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { EmployeeCode } from "../../EmployeeCodeList/hooks/useGetEmployeeCodes";
import { EMPLOYEE_CODE_ROUTES } from "../../../../../constants/routes/settings/employee-code/routes";

type DeleteEmployeeCodeApiResponse = ApiSuccessResponse<EmployeeCode>;

type UseDeleteEmployeeCodeArgs = {
  options: UseMutationOptions<DeleteEmployeeCodeApiResponse, ApiErrorResponse>;
  employeeCodeId: string;
};

export function useDeleteEmployeeCode({
  employeeCodeId,
  options = {},
}: UseDeleteEmployeeCodeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeCodeKeys.delete(employeeCodeId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteEmployeeCodeApiResponse>(
        EMPLOYEE_CODE_ROUTES.delete(employeeCodeId)
      );

      return data;
    },
    ...options,
  });
}
