import { useQuery, useQueryClient } from "@tanstack/react-query";
import { stateKeys } from "../queryKeysFactories/state";
import type { ApiSuccessResponse } from "../types/apiResponse";
import { useAxiosPrivate } from "./useAxiosPrivate";

export type State = {
  id: string;
  state_name: string;
};

type UseGetStateArgs = {
  countryId: string | null;
};

export function useGetState({ countryId }: UseGetStateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const queryClient = useQueryClient();

  const fetchState = async () => {
    const {
      data: { data = [] },
    } = await axiosPrivate.get<ApiSuccessResponse<State[]>>(
      `api/locations/state/${countryId}`
    );

    return data.map(({ id, state_name }) => ({
      label: state_name,
      value: id,
    }));
  };

  return useQuery({
    queryKey: stateKeys.listing(countryId),
    queryFn: fetchState,
    enabled: !!countryId,
    initialData: () => {
      return queryClient.getQueryData(stateKeys.listing(countryId));
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
