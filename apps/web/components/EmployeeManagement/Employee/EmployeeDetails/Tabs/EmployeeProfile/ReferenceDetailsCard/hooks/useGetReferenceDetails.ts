import { useQuery } from "@tanstack/react-query";
import { EMPLOYEE_REFERENCE_DETAIL_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/reference-detail/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeReferenceDetails } from "../../../../../../../../queryKeysFactories/employeeReferenceDetails";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { ReferenceTypeOptionsKey } from "../../../../../../../common/Autocomplete/hooks/useGetReferenceTypeOptions";

type ReferenceDetailResponse = {
  id: string;
  reference_type: ReferenceTypeOptionsKey;
  reference_employee_id: string;
  reference_name: string;
  reference_mobile_no: string;
  reference_address: string;
  company_id: string;
};

export type ReferenceDetailsResponse = {
  first: ReferenceDetailResponse;
  second: ReferenceDetailResponse;
};

type UseGetReferenceDetailsArgs = {
  employeeId: string;
};

export function useGetReferenceDetails({
  employeeId,
}: UseGetReferenceDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchReferenceDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<ReferenceDetailsResponse>>(
      EMPLOYEE_REFERENCE_DETAIL_ROUTES.get(employeeId)
    );

    return data;
  };

  return useQuery({
    queryKey: employeeReferenceDetails.get(employeeId),
    queryFn: fetchReferenceDetails,
    enabled: !!employeeId,
  });
}
