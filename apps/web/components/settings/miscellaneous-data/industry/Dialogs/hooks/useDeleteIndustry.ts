"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { industryKeys } from "../../../../../../queryKeysFactories/industry";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Industry } from "../../IndustryList/hooks/useGetIndustries";
import { INDUSTRY_ROUTES } from "../../../../../../constants/routes/settings/industry/routes";

type DeleteIndustryApiResponse = ApiSuccessResponse<Industry>;

type UseDeleteIndustryArgs = {
  options: UseMutationOptions<DeleteIndustryApiResponse, ApiErrorResponse>;
  industryId: string;
};

export function useDeleteIndustry({
  industryId,
  options = {},
}: UseDeleteIndustryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: industryKeys.delete(industryId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteIndustryApiResponse>(
        INDUSTRY_ROUTES.delete(industryId)
      );

      return data;
    },
    ...options,
  });
}
