import { useQuery } from "@tanstack/react-query";
import { TAX_SECTIONS_ROUTES } from "../../../../constants/routes/payroll/settings/deductions/investment-deductions/tax-sections/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { taxSectionsKeys } from "../../../../queryKeysFactories/taxSections";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

export function useGetTaxSectionOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTaxSectionOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      TAX_SECTIONS_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    queryKey: taxSectionsKeys.options(),
    queryFn: fetchTaxSectionOption,
    initialData: [],
  });
}
