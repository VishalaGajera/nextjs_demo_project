"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { employeeBasicDetailsKeys } from "../../../../../../../queryKeysFactories/employee";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { EmployeeBasicDetailsFormFieldValues } from "../../EmployeeBasicDetailsForm";
import type { EmployeeBasicDetails } from "../../hooks/useGetEmployeeBasicDetails";
import { EMPLOYEE_BASIC_DETAILS_ROUTES } from "../../../../../../../constants/routes/employee-management/employee/basic-details/routes";

type EditEmployeeBasicDetailsApiResponse =
  ApiSuccessResponse<EmployeeBasicDetails>;

type UseEditEmployeeBasicDetailsArgs = {
  options: UseMutationOptions<
    EditEmployeeBasicDetailsApiResponse,
    ApiErrorResponse<EmployeeBasicDetailsFormFieldValues>,
    Partial<EmployeeBasicDetailsFormFieldValues>
  >;
  employeeId: string;
};

export function useEditEmployeeBasicDetails({
  employeeId,
  options = {},
}: UseEditEmployeeBasicDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeBasicDetailsKeys.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditEmployeeBasicDetailsApiResponse>(
          EMPLOYEE_BASIC_DETAILS_ROUTES.patch(employeeId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
