"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { DEDUCTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/deduction/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { deductionKeys } from "../../../../../../../queryKeysFactories/deduction";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type {
  SalaryComponent,
  SalaryComponentFormFieldValues,
} from "../../../SalaryComponentForm";

type EditDeductionApiResponse = ApiSuccessResponse<SalaryComponent>;

type UseEditDeductionArgs = {
  options: UseMutationOptions<
    EditDeductionApiResponse,
    ApiErrorResponse<SalaryComponentFormFieldValues>,
    Partial<SalaryComponentFormFieldValues>
  >;
  deductionId: string;
};

export function useEditDeduction({
  deductionId,
  options = {},
}: UseEditDeductionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: deductionKeys.edit(deductionId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditDeductionApiResponse>(
        DEDUCTION_ROUTES.patch(deductionId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
