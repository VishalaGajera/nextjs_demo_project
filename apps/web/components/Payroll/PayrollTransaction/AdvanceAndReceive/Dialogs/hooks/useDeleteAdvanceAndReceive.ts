import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { ADVANCE_AND_RECEIVE_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/advance-receive/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { advanceReceiveKeys } from "../../../../../../queryKeysFactories/advanceReceive";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { AdvanceAndReceive } from "../../AdvanceAndReceiveList/hooks/useGetAdvanceAndReceiveList";

type DeleteAdvanceAndReceiveApiResponse = ApiSuccessResponse<AdvanceAndReceive>;

type UseDeleteAdvanceAndReceiveArgs = {
  options: UseMutationOptions<
    DeleteAdvanceAndReceiveApiResponse,
    ApiErrorResponse
  >;
  advanceAndReceiveId: string;
};

export function useDeleteAdvanceAndReceive({
  advanceAndReceiveId,
  options = {},
}: UseDeleteAdvanceAndReceiveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: advanceReceiveKeys.delete(advanceAndReceiveId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteAdvanceAndReceiveApiResponse>(
          ADVANCE_AND_RECEIVE_ROUTES.delete(advanceAndReceiveId)
        );

      return data;
    },
    ...options,
  });
}
