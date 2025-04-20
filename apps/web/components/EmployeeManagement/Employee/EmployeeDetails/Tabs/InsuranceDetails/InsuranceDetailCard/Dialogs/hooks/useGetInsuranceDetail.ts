import { useQuery } from "@tanstack/react-query";

import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeInsuranceDetailKeys } from "../../../../../../../../../queryKeysFactories/employeeInsurance";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import type { InsuranceDetail } from "../../InsuranceDetailList/hooks/useGetInsuranceDetail";
import { EMPLOYEE_INSURANCE_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/insurance-details/routes";

type UseGetInsuranceDetailArgs = {
  insuranceDetailId: InsuranceDetail["id"];
  employeeId: string;
};

export function useGetInsuranceDetail({
  insuranceDetailId,
  employeeId,
}: UseGetInsuranceDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchInsuranceDetail = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<InsuranceDetail>>(
      EMPLOYEE_INSURANCE_DETAILS_ROUTES.get(employeeId, insuranceDetailId)
    );

    return data;
  };

  return useQuery({
    queryKey: employeeInsuranceDetailKeys.get(insuranceDetailId),
    queryFn: fetchInsuranceDetail,
    enabled: !!insuranceDetailId,
  });
}
