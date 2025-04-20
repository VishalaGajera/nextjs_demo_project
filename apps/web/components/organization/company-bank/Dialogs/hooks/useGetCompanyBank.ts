import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { companyBankKeys } from "../../../../../queryKeysFactories/companyBanks";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { CompanyBank } from "../../CompanyBankList/hooks/useGetCompanyBanks";
import { BANK_ROUTES } from "../../../../../constants/routes/organization/bank/routes";

type UseGetCompanyBankArgs = {
  companyBankId: CompanyBank["id"];
};

export function useGetCompanyBank({ companyBankId }: UseGetCompanyBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchCompanyBank = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<CompanyBank>>(
      BANK_ROUTES.get(companyBankId)
    );

    return data;
  };

  return useQuery({
    queryKey: companyBankKeys.get(companyBankId),
    queryFn: fetchCompanyBank,
    enabled: !!companyBankId,
  });
}
