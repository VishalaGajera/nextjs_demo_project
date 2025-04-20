import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { BUSINESS_UNIT_ROUTES } from "../../../../../constants/routes/organization/business-unit/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../../queryKeysFactories/businessUnit";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { UnitHead } from "../../../../settings/miscellaneous-data/department/DepartmentList/hooks/useGetDepartments";

export type BusinessUnit = {
  id: string;
  company_id: string;
  business_unit_name: string;
  email: string;
  phone_no: string;
  mobile_no: string;
  address: string;
  unit_license_no: string;
  city_id: string;
  state_id: string;
  country_id: string;
  pin_code: string;
  company_name: string;
  city_name: string;
  state_name: string;
  country_name: string;
  business_unit_heads: UnitHead[];
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetBusinessUnitsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetBusinessUnitsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getBusinessUnits = async ({ body }: GetBusinessUnitsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        businessUnits: BusinessUnit[];
        totalCount: number;
      }>
    >(BUSINESS_UNIT_ROUTES.listing, body);

    return data.data;
  };

  return { getBusinessUnits };
}

//NOTE: for future use
export function useGetBusinessUnits({ body }: GetBusinessUnitsArgs) {
  const { getBusinessUnits } = useGetBusinessUnitsQueryFn();

  return useQuery({
    queryKey: businessUnitsKeys.listing(body),
    queryFn: () => getBusinessUnits({ body }),
    initialData: { businessUnits: [], totalCount: 0 },
  });
}
