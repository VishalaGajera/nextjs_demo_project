import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { bankKeys } from "../../../../queryKeysFactories/bank";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { BANK_ROUTES } from "../../../../constants/routes/settings/bank/routes";

export function useGetBankOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      BANK_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    queryKey: bankKeys.options(),
    queryFn: fetchBankOption,
    initialData: [],
  });
}
