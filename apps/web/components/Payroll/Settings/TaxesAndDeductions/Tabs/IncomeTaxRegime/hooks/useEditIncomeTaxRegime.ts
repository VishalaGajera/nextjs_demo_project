"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { INCOME_TAX_REGIME_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/income-tax-regime/routes";
import { incomeTaxRegimeKeys } from "../../../../../../../queryKeysFactories/Payroll/Settings/TaxesAndDeductions/incomeTaxRegime";
import { type IncomeTaxRegimeFieldValues } from "../IncomeTaxRegimeForm";
import { type IncomeTaxRegimePayload } from "./useAddIncomeTaxRegime";

type EditIncomeTaxRegimeApiResponse =
  ApiSuccessResponse<IncomeTaxRegimePayload>;

type UseEditIncomeTaxRegimeArgs = {
  options: UseMutationOptions<
    EditIncomeTaxRegimeApiResponse,
    ApiErrorResponse<IncomeTaxRegimeFieldValues>,
    Partial<IncomeTaxRegimePayload>
  >;
  incomeTaxRegimeId: string;
};

export function useEditIncomeTaxRegime({
  incomeTaxRegimeId,
  options = {},
}: UseEditIncomeTaxRegimeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: incomeTaxRegimeKeys.edit(incomeTaxRegimeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditIncomeTaxRegimeApiResponse>(
        INCOME_TAX_REGIME_ROUTES.patch(incomeTaxRegimeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
