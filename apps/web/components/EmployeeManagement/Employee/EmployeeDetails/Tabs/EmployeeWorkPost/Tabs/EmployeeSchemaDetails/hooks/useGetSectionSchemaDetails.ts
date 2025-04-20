import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { SchemaItem, SectionKeys } from "./useGetSchemaDetails";
import { employeeSchemaDetails } from "../../../../../../../../../queryKeysFactories/employeeSchemaDetails";
import { DateTime } from "luxon";
import { EMPLOYEE_SCHEME_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/scheme-details/routes";

type UseGetSectionSchemaDetailsArgs = {
  employeeId: string;
  section: SectionKeys;
};

export function useGetSectionSchemaDetail({
  employeeId,
  section,
}: UseGetSectionSchemaDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const fetchEmployeeSchemaDetails = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<SchemaItem>>(
      EMPLOYEE_SCHEME_DETAILS_ROUTES.get(employeeId, section, currentDate)
    );

    return data.data;
  };

  return useQuery({
    queryKey: employeeSchemaDetails.get(employeeId, section),
    queryFn: fetchEmployeeSchemaDetails,
    enabled: !!employeeId,
    refetchInterval: 0,
  });
}
