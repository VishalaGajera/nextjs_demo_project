"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { DEDUCTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/deduction/routes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { deductionKeys } from "../../../../../../../queryKeysFactories/deduction";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type DeleteDeductionApiResponse = ApiSuccessResponse<SalaryComponent>;

type UseDeleteDeductionArgs = {
  options: UseMutationOptions<DeleteDeductionApiResponse, ApiErrorResponse>;
  deductionId: string;
};

export function useDeleteDeduction({
  deductionId,
  options = {},
}: UseDeleteDeductionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: deductionKeys.delete(deductionId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteDeductionApiResponse>(
        DEDUCTION_ROUTES.delete(deductionId)
      );

      return data;
    },
    ...options,
  });
}
