import { useQuery } from "@tanstack/react-query";
import { ESIC_ROUTES } from "../../../../constants/routes/payroll/settings/contributions/esic/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { esicKeys } from "../../../../queryKeysFactories/esic";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

export function useGetESICGroupAutocomplete() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchESICGroupOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      ESIC_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    queryKey: esicKeys.options(),
    queryFn: fetchESICGroupOptions,
    initialData: [],
  });
}
