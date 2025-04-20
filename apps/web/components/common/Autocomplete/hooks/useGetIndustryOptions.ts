import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { industryKeys } from "../../../../queryKeysFactories/industry";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { INDUSTRY_ROUTES } from "../../../../constants/routes/settings/industry/routes";

export function useGetIndustryOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchIndustryOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      INDUSTRY_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    queryKey: industryKeys.options(),
    queryFn: fetchIndustryOption,
    initialData: [],
  });
}
