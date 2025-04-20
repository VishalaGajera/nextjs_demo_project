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

type EditBankHolidayApiSuccessResponse = ApiSuccessResponse<BankHolidayType>;

type UseEditBankHolidayArgs = {
  companyId: string;
  bankHolidayId: string;
  options: UseMutationOptions<
    EditBankHolidayApiSuccessResponse,
    ApiErrorResponse<BankHolidayFormFieldValues>,
    Partial<BankHolidayFormFieldValues>
  >;
};

export function useEditBankHoliday({
  options = {},
  companyId,
  bankHolidayId,
}: UseEditBankHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankHolidayKeys.edit(companyId, bankHolidayId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditBankHolidayApiSuccessResponse>(
          BANK_HOLIDAY_GROUP_ROUTES.patch(companyId, bankHolidayId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
