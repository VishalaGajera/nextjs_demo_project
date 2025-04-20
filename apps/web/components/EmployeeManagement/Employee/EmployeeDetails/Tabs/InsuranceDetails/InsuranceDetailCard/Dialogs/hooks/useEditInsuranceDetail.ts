"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeInsuranceDetailKeys } from "../../../../../../../../../queryKeysFactories/employeeInsurance";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { InsuranceDetailFormFieldValues } from "../InsuranceDetailForm";
import { EMPLOYEE_INSURANCE_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/insurance-details/routes";

type useEditInsuranceDetailApiResponse = ApiSuccessResponse<null>;

type UseEditInsuranceDetailArgs = {
  options: UseMutationOptions<
    useEditInsuranceDetailApiResponse,
    ApiErrorResponse<InsuranceDetailFormFieldValues>,
    Partial<InsuranceDetailFormFieldValues>
  >;
  employeeId: string;
  insuranceDetailId: string;
};

export function useEditInsuranceDetail({
  employeeId,
  insuranceDetailId,
  options = {},
}: UseEditInsuranceDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeInsuranceDetailKeys.edit(insuranceDetailId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<useEditInsuranceDetailApiResponse>(
          EMPLOYEE_INSURANCE_DETAILS_ROUTES.patch(
            employeeId,
            insuranceDetailId
          ),
          formValues
        );

      return data;
    },
    ...options,
  });
}
