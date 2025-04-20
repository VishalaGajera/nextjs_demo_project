import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { BANK_HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/bank-configurations/bank-holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankHolidayKeys } from "../../../../../../queryKeysFactories/bankHolidayGroup";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { BankHolidayType } from "./useGetBankHolidayGroupListColumns";

type GetBankHolidaysArgs = {
  body?: Partial<IGetRowsParams> | QuickFilter;
  companyId: string;
  year: string;
};

export function useGetBankHolidaysQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getBankHolidays = async ({
    body = {},
    companyId,
    year,
  }: GetBankHolidaysArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        holidays: BankHolidayType[];
        totalCount: number;
      }>
    >(BANK_HOLIDAY_GROUP_ROUTES.getHolidayById(companyId, year), body);

    return data.data;
  };

  return { getBankHolidays };
}

export function useGetBankHolidays({
  body,
  companyId,
  year,
}: GetBankHolidaysArgs) {
  const { getBankHolidays } = useGetBankHolidaysQueryFn();

  return useQuery({
    queryKey: bankHolidayKeys.listing(body),
    queryFn: () => getBankHolidays({ companyId, body, year }),
    initialData: { holidays: [], totalCount: 0 },
  });
}
