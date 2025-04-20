import { useQuery } from "@tanstack/react-query";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankHolidayYearKeys } from "../../../../../../queryKeysFactories/bankHolidayGroup";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

type BankHolidayYearsResponse = {
  year: string;
};

type UseGetBankHolidayYearsListArgs = {
  companyId: string;
};
export function useGetBankHolidayYearsList({
  companyId,
}: UseGetBankHolidayYearsListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankHolidayGroup = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<BankHolidayYearsResponse[]>>(
      BANK_HOLIDAY_GROUP_ROUTES.getHolidayByYear(companyId)
    );

    return data;
  };

  return useQuery({
    queryKey: bankHolidayYearKeys.listing({ companyId }),
    queryFn: fetchBankHolidayGroup,
  });
}
