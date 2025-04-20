import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cityKeys } from "../queryKeysFactories/city";
import type { ApiSuccessResponse } from "../types/apiResponse";
import { useAxiosPrivate } from "./useAxiosPrivate";

export type City = {
  id: string;
  city_name: string;
};

type UseGetCityArgs = {
  stateId: string | null;
};

export function useGetCity({ stateId }: UseGetCityArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const queryClient = useQueryClient();

  const fetchCity = async () => {
    const {
      data: { data = [] },
    } = await axiosPrivate.get<ApiSuccessResponse<City[]>>(
      `api/locations/city/${stateId}`
    );

    return data.map(({ id, city_name }) => ({
      label: city_name,
      value: id,
    }));
  };

  return useQuery({
    queryKey: cityKeys.listing(stateId),
    queryFn: fetchCity,
    enabled: !!stateId,
    initialData: () => {
      return queryClient.getQueryData(cityKeys.listing(stateId));
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
