import { useQuery } from "@tanstack/react-query";
import { INVESTMENT_SCHEMES_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/investment-schemes/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { investmentSchemesKeys } from "../../../../../../../../queryKeysFactories/investmentSchemes";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { InvestmentSchemesFormFieldValues } from "../InvestmentSchemesForm";

type UseGetInvestmentSchemesArgs = {
  investmentSchemesId: string;
};

export function useGetInvestmentSchemes({
  investmentSchemesId,
}: UseGetInvestmentSchemesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchInvestmentSchemes = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<InvestmentSchemesFormFieldValues>
    >(INVESTMENT_SCHEMES_ROUTES.get(investmentSchemesId));

    return data;
  };

  return useQuery({
    queryKey: investmentSchemesKeys.get(investmentSchemesId),
    queryFn: fetchInvestmentSchemes,
    enabled: !!investmentSchemesId,
  });
}
