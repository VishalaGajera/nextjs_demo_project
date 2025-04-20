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

type AddInsuranceApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddInsuranceArgs = {
  options: UseMutationOptions<
    AddInsuranceApiSuccessResponse,
    ApiErrorResponse<InsuranceDetailFormFieldValues>,
    Partial<InsuranceDetailFormFieldValues>
  >;
  employeeId: string;
};

export type PayloadInsurance = Partial<{
  insurance_type: string | null;
  insured_name: string | null;
  insurance_provider: string | null;
  policy_no: string | null;
  insured_amount: number | null;
  relation: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}>;
export function useAddInsuranceDetail({
  options = {},
  employeeId,
}: UseAddInsuranceArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeInsuranceDetailKeys.add(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddInsuranceApiSuccessResponse>(
        EMPLOYEE_INSURANCE_DETAILS_ROUTES.post(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
