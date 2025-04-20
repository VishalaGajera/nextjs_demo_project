import { useQuery } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankHolidayGroupKeys } from "../../../../../queryKeysFactories/bankHolidayGroup";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type BankHolidayGroupListType = {
  id: string;
  name: string;
  company_name: string;
};

export function useGetBankHolidayGroupList() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankHolidayGroup = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<BankHolidayGroupListType[]>>(
      BANK_HOLIDAY_GROUP_ROUTES.listing
    );

    return data;
  };

  return useQuery({
    queryKey: bankHolidayGroupKeys.listing(),
    queryFn: fetchBankHolidayGroup,
  });
}
