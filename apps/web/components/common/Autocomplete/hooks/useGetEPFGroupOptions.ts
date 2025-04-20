import { useQuery } from "@tanstack/react-query";
import { PROVIDENT_FUND_ROUTES } from "../../../../constants/routes/payroll/settings/contributions/pf/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { providentFundKeys } from "../../../../queryKeysFactories/providentFund";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

export function useGetEPFGroupOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEPFGroupOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      PROVIDENT_FUND_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    queryKey: providentFundKeys.options(),
    queryFn: fetchEPFGroupOptions,
    initialData: [],
  });
}
