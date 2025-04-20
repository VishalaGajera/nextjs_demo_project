"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankHolidayYearKeys } from "../../../../../../queryKeysFactories/bankHolidayGroup";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { BankHolidayType } from "../../BankHolidayList/hooks/useGetBankHolidayGroupListColumns";
import type { AddBankHolidayYearFormFieldValues } from "../AddBankHolidayYearFrom";

type AddBankHolidayYearApiSuccessResponse = ApiSuccessResponse<BankHolidayType>;

type UseAddBankHolidayYearArgs = {
  options: UseMutationOptions<
    AddBankHolidayYearApiSuccessResponse,
    ApiErrorResponse<AddBankHolidayYearFormFieldValues>,
    Partial<Omit<AddBankHolidayYearFormFieldValues, "year"> & { year: number }>
  >;
  companyId: string;
};

export function useAddBankHolidayYear({
  options = {},
  companyId,
}: UseAddBankHolidayYearArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankHolidayYearKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBankHolidayYearApiSuccessResponse>(
          BANK_HOLIDAY_GROUP_ROUTES.addBankHolidayYear(companyId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
