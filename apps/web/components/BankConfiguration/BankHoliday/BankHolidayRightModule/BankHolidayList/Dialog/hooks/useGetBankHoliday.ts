import { useQuery } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { bankHolidayKeys } from "../../../../../../../queryKeysFactories/bankHolidayGroup";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { BankHolidayType } from "../../hooks/useGetBankHolidayGroupListColumns";

type UseGetBankHolidayArgs = {
  bankHolidayId: string;
  companyId: string;
};

export function useGetBankHoliday({
  bankHolidayId,
  companyId,
}: UseGetBankHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankHoliday = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<BankHolidayType>>(
      BANK_HOLIDAY_GROUP_ROUTES.get(companyId, bankHolidayId)
    );

    return data;
  };

  return useQuery({
    queryKey: bankHolidayKeys.get(bankHolidayId),
    queryFn: fetchBankHoliday,
    enabled: !!bankHolidayId && !!companyId,
  });
}
