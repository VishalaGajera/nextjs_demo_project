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
import type { ProvidentFundFormFieldValues } from "../ProvidentFundForm";

type EditProvidentFundApiResponse = ApiSuccessResponse<ProvidentFundRecord>;

type UseEditProvidentFundArgs = {
  options: UseMutationOptions<
    EditProvidentFundApiResponse,
    ApiErrorResponse<ProvidentFundFormFieldValues>,
    Partial<ProvidentFundFormFieldValues>
  >;
  providentFundId: string;
};

export function useEditProvidentFund({
  providentFundId,
  options = {},
}: UseEditProvidentFundArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: providentFundKeys.edit(providentFundId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditProvidentFundApiResponse>(
        PROVIDENT_FUND_ROUTES.patch(providentFundId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
