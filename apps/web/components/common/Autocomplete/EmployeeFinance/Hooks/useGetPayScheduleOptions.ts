import { useQuery } from "@tanstack/react-query";
import { PAY_SCHEDULE_SETUP_ROUTES } from "../../../../../constants/routes/payroll/settings/pay-schedule-setup/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { payScheduleSetupKeys } from "../../../../../queryKeysFactories/payScheduleSetup";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { OptionsType } from "../../../../../types/options";

type UseGetPayScheduleOptionsArgs = {
  companyId: string;
};

export function useGetPayScheduleOptions({
  companyId,
}: UseGetPayScheduleOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPayScheduleOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      PAY_SCHEDULE_SETUP_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: payScheduleSetupKeys.option(companyId),
    queryFn: fetchPayScheduleOptions,
    enabled: !!companyId,
    initialData: [],
  });
}
