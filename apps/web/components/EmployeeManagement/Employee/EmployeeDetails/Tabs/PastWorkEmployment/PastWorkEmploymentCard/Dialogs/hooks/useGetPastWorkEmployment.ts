import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { pastWorkEmploymentKeys } from "../../../../../../../../../queryKeysFactories/pastWorkEmployment";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { PastWorkEmployment } from "../../PastWorkEmploymentList/hooks/useGetPastWorkEmployments";
import { EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/past-work-employment/routes";

type UseGetPastWorkEmploymentArgs = {
  pastWorkEmploymentId: PastWorkEmployment["id"];
  employeeId: string;
};

export function useGetPastWorkEmployment({
  pastWorkEmploymentId,
  employeeId,
}: UseGetPastWorkEmploymentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPastWorkEmployment = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<PastWorkEmployment>>(
      EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES.get(employeeId, pastWorkEmploymentId)
    );

    return data;
  };

  return useQuery({
    queryKey: pastWorkEmploymentKeys.get(pastWorkEmploymentId),
    queryFn: fetchPastWorkEmployment,
    enabled: !!pastWorkEmploymentId,
  });
}
