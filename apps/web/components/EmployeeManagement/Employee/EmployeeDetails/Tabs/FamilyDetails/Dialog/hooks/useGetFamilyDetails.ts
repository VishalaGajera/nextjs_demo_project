import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { familyKeys } from "../../../../../../../../queryKeysFactories/family";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { FamilyDetails } from "./useAddFamilyDetails";
import { EMPLOYEE_FAMILY_DETAILS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/family-details/routes";

type UseGetFamilyDetailsArgs = {
  familyId: FamilyDetails["id"];
  employeeId: string;
};

export function useGetFamilyDetails({
  familyId,
  employeeId,
}: UseGetFamilyDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchFamilyDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<FamilyDetails>>(
      EMPLOYEE_FAMILY_DETAILS_ROUTES.get(employeeId, familyId)
    );

    return data;
  };

  return useQuery({
    queryKey: familyKeys.get(familyId),
    queryFn: fetchFamilyDetails,
    enabled: !!familyId,
  });
}
