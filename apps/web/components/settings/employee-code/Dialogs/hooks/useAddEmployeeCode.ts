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

type AddEmployeeCodeApiSuccessResponse = ApiSuccessResponse<EmployeeCode>;

type UseAddEmployeeCodeArgs = {
  options: UseMutationOptions<
    AddEmployeeCodeApiSuccessResponse,
    ApiErrorResponse<EmployeeCodeFormFieldValues>,
    Partial<EmployeeCodeFormFieldValues>
  >;
};

export function useAddEmployeeCode({ options = {} }: UseAddEmployeeCodeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeCodeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddEmployeeCodeApiSuccessResponse>(
          EMPLOYEE_CODE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
