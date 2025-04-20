"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { INCOME_TAX_REGIME_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/income-tax-regime/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { incomeTaxRegimeKeys } from "../../../../../../../queryKeysFactories/Payroll/Settings/TaxesAndDeductions/incomeTaxRegime";
import { type IncomeTaxRegimeFieldValues } from "../IncomeTaxRegimeForm";

export type IncomeTaxRegimePayload = Omit<
  IncomeTaxRegimeFieldValues,
  "financial_year"
> & {
  financial_year: {
    start_date?: string;
    end_date?: string;
  };
};

type AddIncomeTaxRegimeApiSuccessResponse =
  ApiSuccessResponse<IncomeTaxRegimePayload>;

type UseAddIncomeTaxRegimeArgs = {
  options: UseMutationOptions<
    AddIncomeTaxRegimeApiSuccessResponse,
    ApiErrorResponse<IncomeTaxRegimeFieldValues>,
    Partial<IncomeTaxRegimePayload>
  >;
};

export function useAddIncomeTaxRegime({
  options = {},
}: UseAddIncomeTaxRegimeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: incomeTaxRegimeKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddIncomeTaxRegimeApiSuccessResponse>(
          INCOME_TAX_REGIME_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
