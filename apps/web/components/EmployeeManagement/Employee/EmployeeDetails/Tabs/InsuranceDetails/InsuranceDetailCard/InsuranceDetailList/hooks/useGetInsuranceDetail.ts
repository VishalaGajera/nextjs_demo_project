import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeInsuranceDetailKeys } from "../../../../../../../../../queryKeysFactories/employeeInsurance";
import type { QuickFilter } from "../../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";
import { EMPLOYEE_INSURANCE_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/insurance-details/routes";

export type InsuranceDetail = {
  id: string;
  insurance_type: string;
  insured_name: string;
  policy_no: string;
  insured_amount: number;
  relation: string;
  issue_date: string;
  expiry_date: string;
  insurance_provider: string;
};

type GetInsuranceDetailArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  employeeId: string;
};

export function useGetInsuranceDetailQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getInsuranceDetail = async ({
    body,
    employeeId,
  }: GetInsuranceDetailArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        insuranceDetails: InsuranceDetail[];
        totalCount: number;
      }>
    >(EMPLOYEE_INSURANCE_DETAILS_ROUTES.listing(employeeId), body);

    return data.data;
  };

  return { getInsuranceDetail };
}

export function useGetInsuranceDetail({
  body,
  employeeId,
}: GetInsuranceDetailArgs) {
  const { getInsuranceDetail } = useGetInsuranceDetailQueryFn();

  return useQuery({
    queryKey: employeeInsuranceDetailKeys.listing(body),
    queryFn: () => getInsuranceDetail({ body, employeeId }),
    initialData: { insuranceDetails: [], totalCount: 0 },
  });
}
