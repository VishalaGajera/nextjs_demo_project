"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { companyKeys } from "../../../../../queryKeysFactories/company";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { Company } from "../../CompanyList/hooks/useGetCompanies";
import { COMPANY_ROUTES } from "../../../../../constants/routes/organization/company/routes";

type DeleteCompanyApiResponse = ApiSuccessResponse<Company>;

type UseDeleteCompanyArgs = {
  options: UseMutationOptions<DeleteCompanyApiResponse, ApiErrorResponse>;
  companyId: string;
};

export function useDeleteCompany({
  companyId,
  options = {},
}: UseDeleteCompanyArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: companyKeys.delete(companyId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteCompanyApiResponse>(
        COMPANY_ROUTES.delete(companyId)
      );

      return data;
    },
    ...options,
  });
}
