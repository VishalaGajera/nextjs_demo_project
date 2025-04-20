import { useQuery } from "@tanstack/react-query";
import type { OvertimeRateType } from "../../OvertimeRateTypeList/hooks/useGetOvertimeRateTypes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { overtimeRateTypeKeys } from "../../../../../../queryKeysFactories/overtimeRateType";
import type { OvertimeRateTypeFormFieldValues } from "../OvertimeRateTypeForm";
import { OVERTIME_RATE_TYPE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rate-type/routes";

type UseGetOvertimeRateTypeArgs = {
  overtimeRateTypeId: OvertimeRateType["id"];
};

export function useGetOvertimeRateType({
  overtimeRateTypeId,
}: UseGetOvertimeRateTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchOvertimeRateType = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<OvertimeRateTypeFormFieldValues>
    >(OVERTIME_RATE_TYPE_ROUTES.get(overtimeRateTypeId));

    return data;
  };

  return useQuery({
    queryKey: overtimeRateTypeKeys.get(overtimeRateTypeId),
    queryFn: fetchOvertimeRateType,
    enabled: !!overtimeRateTypeId,
  });
}
