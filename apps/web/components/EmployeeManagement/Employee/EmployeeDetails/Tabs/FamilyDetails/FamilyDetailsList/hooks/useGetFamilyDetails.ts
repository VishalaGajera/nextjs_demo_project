import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { familyKeys } from "../../../../../../../../queryKeysFactories/family";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { FamilyDetails } from "../../Dialog/hooks/useAddFamilyDetails";
import { EMPLOYEE_FAMILY_DETAILS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/family-details/routes";

type GetFamilyDetailsArgs = {
  body?:
    | Partial<IGetRowsParams>
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  employeeId: string;
};

export function useGetFamilyDetailsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getFamilyDetails = async ({
    body,
    employeeId,
  }: GetFamilyDetailsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        familyDetails: FamilyDetails[];
        totalCount: number;
      }>
    >(EMPLOYEE_FAMILY_DETAILS_ROUTES.listing(employeeId), body);

    return data.data;
  };

  return { getFamilyDetails };
}

export function useGetFamilyDetails({
  body,
  employeeId,
}: GetFamilyDetailsArgs) {
  const { getFamilyDetails } = useGetFamilyDetailsQueryFn();

  return useQuery({
    queryKey: familyKeys.listing(body),
    queryFn: () => getFamilyDetails({ body, employeeId }),
    initialData: { familyDetails: [], totalCount: 0 },
  });
}
