import { useQuery } from "@tanstack/react-query";
import { PROVIDENT_FUND_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/pf/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { providentFundKeys } from "../../../../../../../../queryKeysFactories/providentFund";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { ProvidentFundRecord } from "../../ProvidentFundList/hooks/useGetProvidentFundList";
import type { ProvidentFundFormFieldValues } from "../ProvidentFundForm";

type UseGetProvidentFundArgs = {
  providentFundId: ProvidentFundRecord["id"];
};

export function useGetProvidentFund({
  providentFundId,
}: UseGetProvidentFundArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchProvidentFund = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<ProvidentFundFormFieldValues>
    >(PROVIDENT_FUND_ROUTES.get(providentFundId));

    return data;
  };

  return useQuery({
    queryKey: providentFundKeys.get(providentFundId),
    queryFn: fetchProvidentFund,
    enabled: !!providentFundId,
  });
}
