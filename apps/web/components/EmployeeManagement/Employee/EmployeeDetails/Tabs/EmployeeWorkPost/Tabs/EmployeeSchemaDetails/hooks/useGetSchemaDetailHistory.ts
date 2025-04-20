import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { Histories } from "../../EmployeeOrganizationDetails/hooks/useGetOrganizationHistory";
import { employeeSchemaDetails } from "../../../../../../../../../queryKeysFactories/employeeSchemaDetails";
import type { SectionKeys } from "./useGetSchemaDetails";
import { DateTime } from "luxon";
import { EMPLOYEE_SCHEME_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/scheme-details/routes";

type useGetSchemaDetailHistoryArgs = {
  employeeId: string;
  section: SectionKeys;
  body?: IGetRowsParams;
};
export function useGetSchemaDetailHistoryQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSchemaDetailHistory = async ({
    employeeId,
    section,
    body,
  }: useGetSchemaDetailHistoryArgs) => {
    const currentDate = DateTime.now().toISODate();

    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        histories: Histories[];
        totalCount: number;
      }>
    >(
      EMPLOYEE_SCHEME_DETAILS_ROUTES.getHistory(
        employeeId,
        section,
        currentDate
      ),
      body
    );

    return data.data;
  };

  return { fetchSchemaDetailHistory };
}
export function useGetSchemaDetailHistory({
  employeeId,
  section,
  body,
}: useGetSchemaDetailHistoryArgs) {
  const { fetchSchemaDetailHistory } = useGetSchemaDetailHistoryQueryFn();

  return useQuery({
    queryKey: employeeSchemaDetails.getHistory(employeeId, section),
    queryFn: () => fetchSchemaDetailHistory({ employeeId, section, body }),
    initialData: { histories: [], totalCount: 0 },
  });
}
