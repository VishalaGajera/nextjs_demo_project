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
import type { BankPayScheduleFormFieldValues } from "../BankPayScheduleForm";

type AddBankPayScheduleApiSuccessResponse = ApiSuccessResponse<BankPaySchedule>;

type UseAddBankPayScheduleArgs = {
  options: UseMutationOptions<
    AddBankPayScheduleApiSuccessResponse,
    ApiErrorResponse,
    Partial<BankPayScheduleFormFieldValues>
  >;
};

export function useAddBankPaySchedule({
  options = {},
}: UseAddBankPayScheduleArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankPayScheduleKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBankPayScheduleApiSuccessResponse>(
          BANK_PAY_SCHEDULE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
