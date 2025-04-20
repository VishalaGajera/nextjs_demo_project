import { useQuery } from "@tanstack/react-query";
import { INCOME_TAX_REGIME_ROUTES } from "../../../../constants/routes/payroll/settings/taxes-deductions/income-tax-regime/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { incomeTaxRegimeKeys } from "../../../../queryKeysFactories/Payroll/Settings/TaxesAndDeductions/incomeTaxRegime";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

export function useGetTaxRegimeOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTaxRegimeOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      INCOME_TAX_REGIME_ROUTES.options()
    );

    return data.data;
  };

  return useQuery({
    queryKey: incomeTaxRegimeKeys.options(),
    queryFn: fetchTaxRegimeOptions,
    initialData: [],
  });
}
