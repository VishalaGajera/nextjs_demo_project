"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { bankHolidayKeys } from "../../../../../../../queryKeysFactories/bankHolidayGroup";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { BankHolidayType } from "../../hooks/useGetBankHolidayGroupListColumns";
import type { BankHolidayFormFieldValues } from "../BankHolidayForm";

type AddBankHolidayApiSuccessResponse = ApiSuccessResponse<BankHolidayType>;

type UseAddBankHolidayArgs = {
  companyId: string;
  options: UseMutationOptions<
    AddBankHolidayApiSuccessResponse,
    ApiErrorResponse<BankHolidayFormFieldValues>,
    Partial<BankHolidayFormFieldValues>
  >;
};

export function useAddBankHoliday({
  options = {},
  companyId,
}: UseAddBankHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankHolidayKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBankHolidayApiSuccessResponse>(
          BANK_HOLIDAY_GROUP_ROUTES.post(companyId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
