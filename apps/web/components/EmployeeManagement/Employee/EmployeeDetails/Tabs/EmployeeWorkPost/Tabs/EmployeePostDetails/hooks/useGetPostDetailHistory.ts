import { employeePostDetails } from "./../../../../../../../../../queryKeysFactories/employeePostDetails";
import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { Histories } from "../../EmployeeOrganizationDetails/hooks/useGetOrganizationHistory";
import type { SectionKeys } from "./useGetPostDetails";
import { EMPLOYEE_POST_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/post-details/routes";

type useGetPostDetailHistoryArgs = {
  employeeId: string;
  section: SectionKeys;
  body?: IGetRowsParams;
};
export function useGetPostDetailHistoryQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPostDetailHistory = async ({
    employeeId,
    section,
    body,
  }: useGetPostDetailHistoryArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        histories: Histories[];
        totalCount: number;
      }>
    >(EMPLOYEE_POST_DETAILS_ROUTES.getHistory(employeeId, section), body);

    return data.data;
  };

  return { fetchPostDetailHistory };
}
export function useGetPostDetailHistory({
  employeeId,
  section,
  body,
}: useGetPostDetailHistoryArgs) {
  const { fetchPostDetailHistory } = useGetPostDetailHistoryQueryFn();

  return useQuery({
    queryKey: employeePostDetails.getHistory(employeeId, section),
    queryFn: () => fetchPostDetailHistory({ employeeId, section, body }),
    initialData: { histories: [], totalCount: 0 },
  });
}
