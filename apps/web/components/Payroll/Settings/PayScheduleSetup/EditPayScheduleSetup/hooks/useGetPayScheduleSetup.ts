import { useQuery } from "@tanstack/react-query";
import { PAY_SCHEDULE_SETUP_ROUTES } from "../../../../../../constants/routes/payroll/settings/pay-schedule-setup/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { payScheduleSetupKeys } from "../../../../../../queryKeysFactories/payScheduleSetup";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { PayScheduleSetupFormFieldValues } from "../../AddPayScheduleSetup/PayScheduleSetupForm";
import type { PayScheduleSetup } from "../../PayScheduleSetupList/hooks/useGetPayScheduleSetupList";

type UseGetPayScheduleSetupArgs = {
  payScheduleSetupId: PayScheduleSetup["id"];
};

export function useGetPayScheduleSetup({
  payScheduleSetupId,
}: UseGetPayScheduleSetupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPayScheduleStup = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<PayScheduleSetupFormFieldValues>
    >(PAY_SCHEDULE_SETUP_ROUTES.get(payScheduleSetupId));

    return data;
  };

  return useQuery({
    queryKey: payScheduleSetupKeys.get(payScheduleSetupId),
    queryFn: fetchPayScheduleStup,
    enabled: !!payScheduleSetupId,
  });
}
