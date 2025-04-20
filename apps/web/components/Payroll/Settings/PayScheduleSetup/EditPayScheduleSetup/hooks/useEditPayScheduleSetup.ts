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
import type { PayScheduleSetupFormFieldValues } from "../../AddPayScheduleSetup/PayScheduleSetupForm";
import type { PayScheduleSetup } from "../../PayScheduleSetupList/hooks/useGetPayScheduleSetupList";

type EditPayScheduleSetupApiResponse = ApiSuccessResponse<PayScheduleSetup>;

type UseEditPayScheduleSetupArgs = {
  options: UseMutationOptions<
    EditPayScheduleSetupApiResponse,
    ApiErrorResponse<PayScheduleSetupFormFieldValues>,
    Partial<PayScheduleSetupFormFieldValues>
  >;
  payScheduleSetupId: string;
};

export function useEditPayScheduleSetup({
  payScheduleSetupId,
  options = {},
}: UseEditPayScheduleSetupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: payScheduleSetupKeys.edit(payScheduleSetupId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditPayScheduleSetupApiResponse>(
          PAY_SCHEDULE_SETUP_ROUTES.patch(payScheduleSetupId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
