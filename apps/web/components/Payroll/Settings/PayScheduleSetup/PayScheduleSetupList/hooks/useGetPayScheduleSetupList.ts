import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { PAY_SCHEDULE_SETUP_ROUTES } from "../../../../../../constants/routes/payroll/settings/pay-schedule-setup/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { payScheduleSetupKeys } from "../../../../../../queryKeysFactories/payScheduleSetup";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type PayScheduleSetup = {
  id: string;
  company_name: string;
  pay_schedule_group_name: string;
  frequency: string;
  end_day_of_month: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

type PayScheduleSetupListBody = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetPayScheduleSetupListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getPayScheduleSetupList = async ({
    body,
  }: PayScheduleSetupListBody) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        payScheduleGroups: PayScheduleSetup[];
        totalCount: number;
      }>
    >(PAY_SCHEDULE_SETUP_ROUTES.listing, body);

    return data.data;
  };

  return { getPayScheduleSetupList };
}

export function useGetPayScheduleSetupList({ body }: PayScheduleSetupListBody) {
  const { getPayScheduleSetupList } = useGetPayScheduleSetupListQueryFn();

  return useQuery({
    queryKey: payScheduleSetupKeys.listing(body),
    queryFn: () => getPayScheduleSetupList({ body }),
    initialData: { payScheduleGroups: [], totalCount: 0 },
  });
}
