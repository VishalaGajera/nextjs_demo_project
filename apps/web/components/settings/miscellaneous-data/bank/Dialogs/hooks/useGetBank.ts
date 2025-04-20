import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankKeys } from "../../../../../../queryKeysFactories/bank";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { Bank } from "../../BankList/hooks/useGetBanks";
import { BANK_ROUTES } from "../../../../../../constants/routes/settings/bank/routes";

type UseGetBankArgs = {
  bankId: Bank["id"];
};

export function useGetBank({ bankId }: UseGetBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBank = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Bank>>(
      BANK_ROUTES.get(bankId)
    );

    return data;
  };

  return useQuery({
    queryKey: bankKeys.get(bankId),
    queryFn: fetchBank,
    enabled: !!bankId,
  });
}
