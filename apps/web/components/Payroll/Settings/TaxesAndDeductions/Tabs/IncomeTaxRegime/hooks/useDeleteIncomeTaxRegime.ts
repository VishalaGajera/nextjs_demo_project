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
import { type IncomeTaxRegimes } from "../IncomeTaxRegimeList/hooks/useGeIncomeTaxRegimeList";

type DeleteIncomeTaxRegimeApiResponse = ApiSuccessResponse<IncomeTaxRegimes>;

type UseDeleteIncomeTaxRegimeArgs = {
  options: UseMutationOptions<
    DeleteIncomeTaxRegimeApiResponse,
    ApiErrorResponse
  >;
  incomeTaxRegimeId: string;
};

export function useDeleteIncomeTaxRegime({
  incomeTaxRegimeId,
  options = {},
}: UseDeleteIncomeTaxRegimeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: incomeTaxRegimeKeys.delete(incomeTaxRegimeId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteIncomeTaxRegimeApiResponse>(
          INCOME_TAX_REGIME_ROUTES.delete(incomeTaxRegimeId)
        );

      return data;
    },
    ...options,
  });
}
