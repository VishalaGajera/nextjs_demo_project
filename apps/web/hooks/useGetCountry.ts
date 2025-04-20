import { useQuery, useQueryClient } from "@tanstack/react-query";
import { countryKeys } from "../queryKeysFactories/country";
import type { ApiSuccessResponse } from "../types/apiResponse";
import { useAxiosPrivate } from "./useAxiosPrivate";

export type Country = {
  id: string;
  country_name: string;
};

export function useGetCountry() {
  const { axiosPrivate } = useAxiosPrivate();

  const queryClient = useQueryClient();

  const fetchIndustry = async () => {
    const {
      data: { data = [] },
    } = await axiosPrivate.get<ApiSuccessResponse<Country[]>>(
      "/api/locations/country"
    );

    return data.map(({ id, country_name }) => ({
      label: country_name,
      value: id,
    }));
  };

  return useQuery({
    queryKey: countryKeys.listing(),
    queryFn: fetchIndustry,
    initialData: () => {
      return queryClient.getQueryData(countryKeys.listing());
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
