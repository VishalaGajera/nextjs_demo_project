"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { bankHolidayKeys } from "../../../../../../../queryKeysFactories/bankHolidayGroup";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { BankHolidayType } from "../../hooks/useGetBankHolidayGroupListColumns";

type DeleteBankHolidayApiResponse = ApiSuccessResponse<BankHolidayType>;

type UseDeleteBankHolidayArgs = {
  options: UseMutationOptions<DeleteBankHolidayApiResponse, ApiErrorResponse>;
  companyId: string;
  bankHolidayId: string;
};

export function useDeleteBankHoliday({
  companyId,
  bankHolidayId,
  options = {},
}: UseDeleteBankHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankHolidayKeys.delete(companyId, bankHolidayId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteBankHolidayApiResponse>(
        BANK_HOLIDAY_GROUP_ROUTES.delete(companyId, bankHolidayId)
      );

      return data;
    },
    ...options,
  });
}
