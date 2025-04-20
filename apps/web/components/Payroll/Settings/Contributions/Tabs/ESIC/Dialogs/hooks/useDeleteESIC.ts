import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { ESIC_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/esic/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { esicKeys } from "../../../../../../../../queryKeysFactories/esic";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { ESICRecord } from "../../ESICList/hooks/useGetESICList";

type DeleteESICApiResponse = ApiSuccessResponse<ESICRecord>;

type UseDeleteESICArgs = {
  options: UseMutationOptions<DeleteESICApiResponse, ApiErrorResponse>;
  esicId: string;
};

export function useDeleteESIC({ esicId, options = {} }: UseDeleteESICArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: esicKeys.delete(esicId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteESICApiResponse>(
        ESIC_ROUTES.delete(esicId)
      );

      return data;
    },
    ...options,
  });
}
