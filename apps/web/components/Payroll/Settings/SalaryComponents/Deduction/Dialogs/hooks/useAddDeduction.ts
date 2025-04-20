"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { DEDUCTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/deduction/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { deductionKeys } from "../../../../../../../queryKeysFactories/deduction";
import type {
  SalaryComponent,
  SalaryComponentFormFieldValues,
} from "../../../SalaryComponentForm";

type AddDeductionApiSuccessResponse = ApiSuccessResponse<SalaryComponent>;

type UseAddDeductionArgs = {
  options: UseMutationOptions<
    AddDeductionApiSuccessResponse,
    ApiErrorResponse<SalaryComponentFormFieldValues>,
    Partial<SalaryComponentFormFieldValues>
  >;
};

export function useAddDeduction({ options = {} }: UseAddDeductionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: deductionKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddDeductionApiSuccessResponse>(
        DEDUCTION_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
