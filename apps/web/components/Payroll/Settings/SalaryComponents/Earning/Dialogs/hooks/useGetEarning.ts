import { useQuery } from "@tanstack/react-query";
import { EARNING_DETAILS_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/earning/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { earningKeys } from "../../../../../../../queryKeysFactories/earning";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { Earning } from "../../EarningList/hooks/useGetEarnings";
import type { EarningFormSchemaFieldValues } from "../EarningForm";

type UseGetEarningArgs = {
  earningId: Earning["id"];
};

export function useGetEarning({ earningId }: UseGetEarningArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEarning = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<EarningFormSchemaFieldValues>
    >(EARNING_DETAILS_ROUTES.get(earningId));

    return data;
  };

  return useQuery({
    queryKey: earningKeys.get(earningId),
    queryFn: fetchEarning,
    enabled: !!earningId,
  });
}
