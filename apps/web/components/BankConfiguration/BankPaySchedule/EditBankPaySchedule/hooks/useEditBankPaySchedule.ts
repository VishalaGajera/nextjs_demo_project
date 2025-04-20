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
import type { BankPayScheduleFormFieldValues } from "../../AddBankPaySchedule/BankPayScheduleForm";
import type { BankPaySchedule } from "../../BankPayScheduleList/hooks/useGetBankPayScheduleList";

type EditBankPayScheduleApiResponse = ApiSuccessResponse<BankPaySchedule>;

type UseEditBankPayScheduleArgs = {
  options: UseMutationOptions<
    EditBankPayScheduleApiResponse,
    ApiErrorResponse<BankPayScheduleFormFieldValues>,
    Partial<BankPayScheduleFormFieldValues>
  >;
  bankPayScheduleId: string;
};

export function useEditBankPaySchedule({
  bankPayScheduleId,
  options = {},
}: UseEditBankPayScheduleArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankPayScheduleKeys.edit(bankPayScheduleId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditBankPayScheduleApiResponse>(
        BANK_PAY_SCHEDULE_ROUTES.patch(bankPayScheduleId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
