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

type AddIndustryApiSuccessResponse = ApiSuccessResponse<Industry>;

type UseAddIndustryArgs = {
  options: UseMutationOptions<
    AddIndustryApiSuccessResponse,
    ApiErrorResponse<IndustryFormFieldValues>,
    Partial<IndustryFormFieldValues>
  >;
};

export function useAddIndustry({ options = {} }: UseAddIndustryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: industryKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddIndustryApiSuccessResponse>(
        INDUSTRY_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
