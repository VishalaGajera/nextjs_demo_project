"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { PAY_SCHEDULE_SETUP_ROUTES } from "../../../../../../constants/routes/payroll/settings/pay-schedule-setup/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { payScheduleSetupKeys } from "../../../../../../queryKeysFactories/payScheduleSetup";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { PayScheduleSetup } from "../../PayScheduleSetupList/hooks/useGetPayScheduleSetupList";

type DeletePayScheduleSetupApiResponse = ApiSuccessResponse<PayScheduleSetup>;

type UseDeletePayScheduleSetupArgs = {
  options: UseMutationOptions<
    DeletePayScheduleSetupApiResponse,
    ApiErrorResponse
  >;
  payScheduleSetupId: string;
};

export function useDeletePayScheduleSetup({
  payScheduleSetupId,
  options = {},
}: UseDeletePayScheduleSetupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: payScheduleSetupKeys.delete(payScheduleSetupId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeletePayScheduleSetupApiResponse>(
          PAY_SCHEDULE_SETUP_ROUTES.delete(payScheduleSetupId)
        );

      return data;
    },
    ...options,
  });
}
