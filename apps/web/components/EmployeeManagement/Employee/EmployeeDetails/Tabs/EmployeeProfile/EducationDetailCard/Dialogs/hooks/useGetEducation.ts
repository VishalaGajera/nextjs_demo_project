import { useQuery } from "@tanstack/react-query";

import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeEducationKeys } from "../../../../../../../../../queryKeysFactories/employeeEducation";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { EducationDetails } from "../../EducationDetailList/hooks/useGetEducationDetails";
import { EMPLOYEE_EDUCATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/education-detail/routes";

type UseGetEducationDetailArgs = {
  educationDetailId: EducationDetails["id"];
  employeeId: string;
};

export function useGetEducation({
  educationDetailId,
  employeeId,
}: UseGetEducationDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEducationDetail = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<EducationDetails>>(
      EMPLOYEE_EDUCATION_DETAILS_ROUTES.get(employeeId, educationDetailId)
    );

    return data;
  };

  return useQuery({
    queryKey: employeeEducationKeys.get(educationDetailId),
    queryFn: fetchEducationDetail,
    enabled: !!educationDetailId,
  });
}
