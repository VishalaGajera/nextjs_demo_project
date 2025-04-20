import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { BUSINESS_UNIT_LOCATION_ROUTES } from "../../../../../constants/routes/organization/business-unit-location/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { locationKeys } from "../../../../../queryKeysFactories/location";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { UnitHead } from "../../../../settings/miscellaneous-data/department/DepartmentList/hooks/useGetDepartments";

export type Location = {
  id: string;
  business_unit_id: string;
  business_unit_name: string;
  location_name: string;
  email: string;
  phone_no: string;
  mobile_no: string;
  address: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  country_id: string;
  country_name: string;
  pin_code: string;
  business_unit_location_heads: UnitHead[];
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetLocationsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetLocationsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLocations = async ({ body }: GetLocationsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        businessUnitLocations: Location[];
        totalCount: number;
      }>
    >(BUSINESS_UNIT_LOCATION_ROUTES.listing, body);

    return data.data;
  };

  return { getLocations };
}

export function useGetLocations({ body }: GetLocationsArgs) {
  const { getLocations } = useGetLocationsQueryFn();

  return useQuery({
    queryKey: locationKeys.listing(body),
    queryFn: () => getLocations({ body }),
    initialData: { businessUnitLocations: [], totalCount: 0 },
  });
}
