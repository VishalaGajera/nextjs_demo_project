import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeePostDetails } from "../../../../../../../../../queryKeysFactories/employeePostDetails";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { SectionKeys } from "./useGetPostDetails";
import { EMPLOYEE_POST_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/post-details/routes";

export type PostItemDetail = {
  id: string;
  name: string;
  remark: string;
  effective_from: string;
  joining_date: string;
  action_by: string;
  action_at: string;
};

type UseGetSectionPostDetailsArgs = {
  employeeId: string;
  section?: SectionKeys;
};

export function useGetSectionPostDetail({
  employeeId,
  section,
}: UseGetSectionPostDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeePostDetails = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<PostItemDetail>>(
      EMPLOYEE_POST_DETAILS_ROUTES.getSectionPost(employeeId, section)
    );

    return data.data;
  };

  return useQuery({
    queryKey: employeePostDetails.get(employeeId, section),
    queryFn: fetchEmployeePostDetails,
    enabled: !!employeeId,
    refetchInterval: 0,
  });
}
