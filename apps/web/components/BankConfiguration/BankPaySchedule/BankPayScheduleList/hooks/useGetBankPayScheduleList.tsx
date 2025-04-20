import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { BANK_PAY_SCHEDULE_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-pay-schedule/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankPayScheduleKeys } from "../../../../../queryKeysFactories/bankPaySchedule";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type BankPaySchedule = {
  id: string;
  company_name: string;
  description: string;
  month_year: string;
  weekly_off: number;
  month_days: number;
  payable_days: number;
  total_weekly_off: number;
  total_holiday: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

type UseGetBankPayScheduleListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetBankPayScheduleListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getBankPayScheduleList = async ({
    body,
  }: UseGetBankPayScheduleListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        BankPayScheduleGroups: BankPaySchedule[];
        totalCount: number;
      }>
    >(BANK_PAY_SCHEDULE_ROUTES.listing, body);

    return data.data;
  };

  return { getBankPayScheduleList };
}

export function useGetBankPayScheduleList({
  body,
}: UseGetBankPayScheduleListArgs) {
  const { getBankPayScheduleList } = useGetBankPayScheduleListQueryFn();

  return useQuery({
    queryKey: bankPayScheduleKeys.listing(body),
    queryFn: () => getBankPayScheduleList({ body }),
    initialData: { BankPayScheduleGroups: [], totalCount: 0 },
  });
}
