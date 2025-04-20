import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { companyKeys } from "../../../../../queryKeysFactories/company";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import { COMPANY_ROUTES } from "../../../../../constants/routes/organization/company/routes";

export type Company = {
  id: string;
  company_name: string;
  email: string;
  phone_no: string;
  mobile_no: string;
  director_name: string;
  industry_id: string;
  industry_name: string;
  company_start_date: string;
  company_logo: string;
  authorized_signature: string;
  about_company: string;
  vision_and_mission: string;
  address: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  country_id: string;
  country_name: string;
  pin_code: string;
  cin_no: string;
  //TODO: jaydip, define type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registered_date: any;
  pan_no: string;
  tan_no: string;
  pf_no: string;
  esi_no: string;
  gst_no: string;
  pt_no: string;
  action_by: string;
  action_at: string;
  full_count: string;
  license_no: string;
  lwf_est_code: string;
};

type GetCompaniesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetCompaniesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getCompanies = async ({ body }: GetCompaniesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        companies: Company[];
        totalCount: number;
      }>
    >(COMPANY_ROUTES.listing, body);

    return data.data;
  };

  return { getCompanies };
}

//NOTE: for future use
export function useGetCompanies({ body }: GetCompaniesArgs) {
  const { getCompanies } = useGetCompaniesQueryFn();

  return useQuery({
    queryKey: companyKeys.listing(body),
    queryFn: () => getCompanies({ body }),
    initialData: { companies: [], totalCount: 0 },
  });
}
