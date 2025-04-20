import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeePostDetails } from "../../../../../../../../../queryKeysFactories/employeePostDetails";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_POST_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/post-details/routes";

export type PostItemDetail = {
  id: string;
  name: string;
  remark: string;
  effective_from: string;
  action_by: string;
  action_at: string;
};
export type EmployeePostDetails = {
  department: PostItemDetail;
  sub_department: PostItemDetail;
  designation: PostItemDetail;
  grade: PostItemDetail;
  work_type: PostItemDetail;
  skill_type: PostItemDetail;
};

export type SectionKeys = keyof EmployeePostDetails;

type UseGetPostDetailsArgs = {
  employeeId: string;
};

export function useGetPostDetails({ employeeId }: UseGetPostDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeePostDetails = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeePostDetails>
    >(EMPLOYEE_POST_DETAILS_ROUTES.get(employeeId));

    return data.data;
  };

  return useQuery({
    queryKey: employeePostDetails.get(employeeId),
    queryFn: fetchEmployeePostDetails,
    enabled: !!employeeId,
  });
}
