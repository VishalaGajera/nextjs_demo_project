"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeInsuranceDetailKeys } from "../../../../../../../../../queryKeysFactories/employeeInsurance";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_INSURANCE_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/insurance-details/routes";

type DeleteInsuranceDetailApiResponse = ApiSuccessResponse<null>;

type UseDeleteInsuranceDetailArgs = {
  options: UseMutationOptions<
    DeleteInsuranceDetailApiResponse,
    ApiErrorResponse
  >;
  insuranceDetailId: string;
  employeeId: string;
};

export function useDeleteInsuranceDetail({
  insuranceDetailId,
  employeeId,
  options = {},
}: UseDeleteInsuranceDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeInsuranceDetailKeys.delete(insuranceDetailId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteInsuranceDetailApiResponse>(
          EMPLOYEE_INSURANCE_DETAILS_ROUTES.delete(
            employeeId,
            insuranceDetailId
          )
        );

      return data;
    },
    ...options,
  });
}
