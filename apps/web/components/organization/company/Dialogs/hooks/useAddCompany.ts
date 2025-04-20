"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { COMPANY_ROUTES } from "../../../../../constants/routes/organization/company/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { companyKeys } from "../../../../../queryKeysFactories/company";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { EmployeeCodeTypeKeys } from "../../../../common/Autocomplete/hooks/useGetEmployeeCodeTypeOptions";
import type { Company } from "../../CompanyList/hooks/useGetCompanies";

type AddCompanyApiSuccessResponse = ApiSuccessResponse<Company>;

export type CompanyPayload = {
  basic_details: Partial<{
    company_name: string | null;
    email: string | null;
    phone_no: string | null;
    mobile_no: string | null;
    company_start_date: string | null;
    industry_id: string | null;
    address: string | null;
    city_id: string | null;
    state_id: string | null;
    country_id: string | null;
    pin_code: string | null;
    employee_code_generation_type: EmployeeCodeTypeKeys;
    company_logo: string | null;
    about_company: string | null;
    vision_and_mission: string | null;
  }>;
  statutory_details: Partial<{
    cin_no: string | null;
    registered_date: string | null;
    pan_no: string | null;
    tan_no: string | null;
    pf_no: string | null;
    esi_no: string | null;
    gst_no: string | null;
    pt_no: string | null;
    license_no: string | null;
    lwf_est_code: string | null;
  }>;
};

type UseAddCompanyArgs = {
  options: UseMutationOptions<
    AddCompanyApiSuccessResponse,
    ApiErrorResponse<CompanyPayload>,
    CompanyPayload
  >;
};

export function useAddCompany({ options = {} }: UseAddCompanyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: companyKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddCompanyApiSuccessResponse>(
        COMPANY_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
