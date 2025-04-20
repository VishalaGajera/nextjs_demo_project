import { useQuery } from "@tanstack/react-query";
import { INCOME_TAX_REGIME_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/income-tax-regime/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { incomeTaxRegimeKeys } from "../../../../../../../queryKeysFactories/Payroll/Settings/TaxesAndDeductions/incomeTaxRegime";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import { type IncomeTaxRegimePayload } from "./useAddIncomeTaxRegime";

type UseGetIncomeTaxRegimeArgs = {
  incomeTaxRegimeId: string;
};

export function useGetIncomeTaxRegime({
  incomeTaxRegimeId,
}: UseGetIncomeTaxRegimeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getIncomeTaxRegime = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<IncomeTaxRegimePayload>>(
      INCOME_TAX_REGIME_ROUTES.get(incomeTaxRegimeId)
    );

    return data;
  };

  return useQuery({
    queryKey: incomeTaxRegimeKeys.get(incomeTaxRegimeId),
    queryFn: getIncomeTaxRegime,
    enabled: !!incomeTaxRegimeId,
  });
}
