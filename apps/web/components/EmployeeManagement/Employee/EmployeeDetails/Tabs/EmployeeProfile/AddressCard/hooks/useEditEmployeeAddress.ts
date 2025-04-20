"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { employeeAddressKeys } from "../../../../../../../../queryKeysFactories/employeeAddress";

import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { EmployeeAddressPayload } from "./useGetEmployeeAddress";
import type { EmployeePresentAddress } from "./useGetEmployeePresentAddress";
import { EMPLOYEE_ADDRESS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/address/routes";

type EditCompanyApiResponse = ApiSuccessResponse<EmployeePresentAddress>;

type useEditEmployeeAddressArgs = {
  options: UseMutationOptions<
    EditCompanyApiResponse,
    ApiErrorResponse<EmployeeAddressPayload>,
    Partial<EmployeeAddressPayload>
  >;
  employeeId: string;
};

export function useEditEmployeeAddress({
  employeeId,
  options = {},
}: useEditEmployeeAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeAddressKeys.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditCompanyApiResponse>(
        EMPLOYEE_ADDRESS_ROUTES.patch(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
