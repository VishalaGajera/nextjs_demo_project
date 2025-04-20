import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { PROVIDENT_FUND_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/pf/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { providentFundKeys } from "../../../../../../../../queryKeysFactories/providentFund";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { ProvidentFundRecord } from "../../ProvidentFundList/hooks/useGetProvidentFundList";

type DeleteProvidentFundApiResponse = ApiSuccessResponse<ProvidentFundRecord>;

type UseDeleteProvidentFundArgs = {
  options: UseMutationOptions<DeleteProvidentFundApiResponse, ApiErrorResponse>;
  providentFundId: string;
};

export function useDeleteProvidentFund({
  providentFundId,
  options = {},
}: UseDeleteProvidentFundArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: providentFundKeys.delete(providentFundId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteProvidentFundApiResponse>(
          PROVIDENT_FUND_ROUTES.delete(providentFundId)
        );

      return data;
    },
    ...options,
  });
}
