import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeKeys } from "../../../../../queryKeysFactories/employee";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import { EMPLOYEE_SEARCH_METADATA_ROUTES } from "../../../../../constants/routes/employee-management/employee/search-metadata/routes";

export function useGetEmployeeSearchMetaData() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeSearchMetaData = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<{ draftCount: string }>>(
      EMPLOYEE_SEARCH_METADATA_ROUTES.get
    );

    return data;
  };

  return useQuery({
    queryKey: employeeKeys.searchMetaData(),
    queryFn: fetchEmployeeSearchMetaData,
    initialData: { draftCount: "0" },
  });
}
