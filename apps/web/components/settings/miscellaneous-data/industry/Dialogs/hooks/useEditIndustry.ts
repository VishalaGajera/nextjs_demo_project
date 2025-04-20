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
import type { IndustryFormFieldValues } from "../IndustryForm";
import { INDUSTRY_ROUTES } from "../../../../../../constants/routes/settings/industry/routes";

type EditIndustryApiResponse = ApiSuccessResponse<Industry>;

type UseEditIndustryArgs = {
  options: UseMutationOptions<
    EditIndustryApiResponse,
    ApiErrorResponse<IndustryFormFieldValues>,
    Partial<IndustryFormFieldValues>
  >;
  industryId: string;
};

export function useEditIndustry({
  industryId,
  options = {},
}: UseEditIndustryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: industryKeys.edit(industryId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditIndustryApiResponse>(
        INDUSTRY_ROUTES.patch(industryId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
