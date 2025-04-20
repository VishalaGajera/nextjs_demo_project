import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { INVESTMENT_SCHEMES_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/investment-schemes/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { investmentSchemesKeys } from "../../../../../../../../queryKeysFactories/investmentSchemes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { InvestmentSchemesFormFieldValues } from "../InvestmentSchemesForm";

type EditInvestmentSchemesApiResponse =
  ApiSuccessResponse<InvestmentSchemesFormFieldValues>;

type UseEditInvestmentSchemesArgs = {
  options: UseMutationOptions<
    EditInvestmentSchemesApiResponse,
    ApiErrorResponse<InvestmentSchemesFormFieldValues>,
    Partial<InvestmentSchemesFormFieldValues>
  >;
  investmentSchemesId: string;
};

export function useEditInvestmentSchemes({
  investmentSchemesId,
  options = {},
}: UseEditInvestmentSchemesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: investmentSchemesKeys.edit(investmentSchemesId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditInvestmentSchemesApiResponse>(
          INVESTMENT_SCHEMES_ROUTES.patch(investmentSchemesId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
