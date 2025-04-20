import { useQuery } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankHolidayKeys } from "../../../../../queryKeysFactories/bankHolidayGroup";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

type UseGetBankHolidaysByYearMonthArgs = {
  companyId: string;
  yearMonth: string;
};

export type BankHolidayType = {
  holiday_date: string;
  holiday_name: string;
};

export function useGetBankHolidaysByYearMonth({
  companyId,
  yearMonth,
}: UseGetBankHolidaysByYearMonthArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankHolidaysByYearMonth = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<BankHolidayType[]>>(
      BANK_HOLIDAY_GROUP_ROUTES.getHolidayByYearMonth(companyId, yearMonth)
    );

    return data;
  };

  return useQuery({
    queryKey: bankHolidayKeys.getHolidayByYearMonth(companyId, yearMonth),
    queryFn: fetchBankHolidaysByYearMonth,
    enabled: !!companyId && !!yearMonth,
  });
}
