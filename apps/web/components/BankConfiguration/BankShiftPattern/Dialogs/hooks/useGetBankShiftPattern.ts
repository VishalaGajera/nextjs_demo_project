import { useQuery } from "@tanstack/react-query";
import { BANK_SHIFT_PATTERN_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-shift-pattern/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankShiftPatternsKeys } from "../../../../../queryKeysFactories/bankShiftPatterns";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { BankShiftPatternFormFieldValues } from "../BankShiftPatternForm";

type UseGetBankShiftPatternArgs = {
  bankShiftPatternId: string;
};

export function useGetBankShiftPattern({
  bankShiftPatternId,
}: UseGetBankShiftPatternArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankShiftPattern = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<BankShiftPatternFormFieldValues>
    >(BANK_SHIFT_PATTERN_ROUTES.get(bankShiftPatternId));

    return data;
  };

  return useQuery({
    queryKey: bankShiftPatternsKeys.get(bankShiftPatternId),
    queryFn: fetchBankShiftPattern,
    enabled: !!bankShiftPatternId,
  });
}
