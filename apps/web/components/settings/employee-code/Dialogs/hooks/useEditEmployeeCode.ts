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
import type { EmployeeCodeFormFieldValues } from "../EmployeeCodeForm";
import { EMPLOYEE_CODE_ROUTES } from "../../../../../constants/routes/settings/employee-code/routes";

type EditEmployeeCodeApiResponse = ApiSuccessResponse<EmployeeCode>;

type UseEditEmployeeCodeArgs = {
  options: UseMutationOptions<
    EditEmployeeCodeApiResponse,
    ApiErrorResponse<EmployeeCodeFormFieldValues>,
    Partial<EmployeeCodeFormFieldValues>
  >;
  employeeCodeId: string;
};

export function useEditEmployeeCode({
  employeeCodeId,
  options = {},
}: UseEditEmployeeCodeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeCodeKeys.edit(employeeCodeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditEmployeeCodeApiResponse>(
        EMPLOYEE_CODE_ROUTES.patch(employeeCodeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
