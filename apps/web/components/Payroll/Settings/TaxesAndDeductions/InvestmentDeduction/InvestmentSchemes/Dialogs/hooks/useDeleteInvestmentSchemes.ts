import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { INVESTMENT_SCHEMES_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/investment-schemes/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { investmentSchemesKeys } from "../../../../../../../../queryKeysFactories/investmentSchemes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { InvestmentSchemesRecord } from "../../InvestmentSchemesList/hooks/useGetInvestmentSchemesList";

type DeleteInvestmentSchemesApiResponse =
  ApiSuccessResponse<InvestmentSchemesRecord>;

type UseDeleteInvestmentSchemesArgs = {
  options: UseMutationOptions<
    DeleteInvestmentSchemesApiResponse,
    ApiErrorResponse
  >;
  investmentSchemesId: string;
};

export function useDeleteInvestmentSchemes({
  investmentSchemesId,
  options = {},
}: UseDeleteInvestmentSchemesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: investmentSchemesKeys.delete(investmentSchemesId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteInvestmentSchemesApiResponse>(
          INVESTMENT_SCHEMES_ROUTES.delete(investmentSchemesId)
        );

      return data;
    },
    ...options,
  });
}
