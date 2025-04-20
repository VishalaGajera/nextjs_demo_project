import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { EMPLOYEE_STATUTORY_DETAILS_ROUTES } from "../../../../../../../../../../../constants/routes/employee-management/employee/finance/statutory-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../../../hooks/useAxiosPrivate";
import { statutoryKeys } from "../../../../../../../../../../../queryKeysFactories/statutory";
import type { ApiSuccessResponse } from "../../../../../../../../../../../types/apiResponse";

type UseGetStatutoryHistoryArgs = {
  employeeId: string;
  body?: IGetRowsParams;
};

export type StatutoryHistoryType = {
  pf_applicable: boolean;
  effective_from: string;
  effective_to: string;
  epf_group_name: string;
  pf_account_no: string;
  pf_joining_date: string;
  uan_no: string;
  esic_applicable: boolean;
  esic_group_name: string;
  esic_no: string;
  esic_joining_date: string;
  pt_applicable: boolean;
  lwf_applicable: boolean;
  tds_applicable: boolean;
  tax_regime_name: string;
  status: string;
  action_by: string;
  action_at: string;
  full_count: string;
};
export function useGetStatutoryHistoryQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchStatutoryHistory = async ({
    employeeId,
    body,
  }: UseGetStatutoryHistoryArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        histories: StatutoryHistoryType[];
        totalCount: number;
      }>
    >(EMPLOYEE_STATUTORY_DETAILS_ROUTES.postHistory(employeeId), body);

    return data.data;
  };

  return { fetchStatutoryHistory };
}
export function useGetStatutoryHistory({
  employeeId,
  body,
}: UseGetStatutoryHistoryArgs) {
  const { fetchStatutoryHistory } = useGetStatutoryHistoryQueryFn();

  return useQuery({
    queryKey: statutoryKeys.get(employeeId),
    queryFn: () => fetchStatutoryHistory({ employeeId, body }),
    initialData: { histories: [], totalCount: 0 },
  });
}
