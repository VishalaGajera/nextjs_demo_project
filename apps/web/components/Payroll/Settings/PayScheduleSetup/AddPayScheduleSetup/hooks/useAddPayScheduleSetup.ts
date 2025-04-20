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
import type { PayScheduleSetupFormFieldValues } from "../PayScheduleSetupForm";

type AddPayScheduleSetupApiSuccessResponse =
  ApiSuccessResponse<PayScheduleSetup>;

type UseAddPayScheduleSetupArgs = {
  options: UseMutationOptions<
    AddPayScheduleSetupApiSuccessResponse,
    ApiErrorResponse,
    Partial<PayScheduleSetupFormFieldValues>
  >;
};

export function useAddPayScheduleSetup({
  options = {},
}: UseAddPayScheduleSetupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: payScheduleSetupKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddPayScheduleSetupApiSuccessResponse>(
          PAY_SCHEDULE_SETUP_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
