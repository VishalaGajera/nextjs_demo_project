import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { overTimeKeys } from "../../../../queryKeysFactories/overTime";
import { OVERTIME_RATE_TYPE_ROUTES } from "../../../../constants/routes/policy-configuration/overtime/overtime-rate-type/routes";

type useGetOvertimeRateTypeOptionsArgs = {
  companyId: string;
};

export function useGetOvertimeRateTypeOptions({
  companyId,
}: useGetOvertimeRateTypeOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchOvertimeRateType = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      OVERTIME_RATE_TYPE_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: overTimeKeys.options(companyId),
    queryFn: fetchOvertimeRateType,
    initialData: [],
    enabled: !!companyId,
  });
}
