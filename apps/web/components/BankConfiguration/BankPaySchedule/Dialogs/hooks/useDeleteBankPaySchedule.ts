"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { BANK_PAY_SCHEDULE_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-pay-schedule/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankPayScheduleKeys } from "../../../../../queryKeysFactories/bankPaySchedule";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { BankPaySchedule } from "../../BankPayScheduleList/hooks/useGetBankPayScheduleList";

type DeleteBankPayScheduleApiResponse = ApiSuccessResponse<BankPaySchedule>;

type UseDeleteBankPayScheduleArgs = {
  options: UseMutationOptions<
    DeleteBankPayScheduleApiResponse,
    ApiErrorResponse
  >;
  bankPayScheduleId: string;
};

export function useDeleteBankPaySchedule({
  bankPayScheduleId,
  options = {},
}: UseDeleteBankPayScheduleArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankPayScheduleKeys.delete(bankPayScheduleId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteBankPayScheduleApiResponse>(
          BANK_PAY_SCHEDULE_ROUTES.delete(bankPayScheduleId)
        );

      return data;
    },
    ...options,
  });
}
