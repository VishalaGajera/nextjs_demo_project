"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { subCasteKeys } from "../../../../../../queryKeysFactories/subCaste";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { SubCaste } from "../../SubCasteList/hooks/useGetSubCastes";
import type { SubCasteFormFieldValues } from "../SubCasteForm";
import { SUB_CASTE_ROUTES } from "../../../../../../constants/routes/settings/sub-caste/routes";

type EditSubCasteApiResponse = ApiSuccessResponse<SubCaste>;

type UseEditSubCasteArgs = {
  options: UseMutationOptions<
    EditSubCasteApiResponse,
    ApiErrorResponse<SubCasteFormFieldValues>,
    Partial<SubCasteFormFieldValues>
  >;
  subCasteId: string;
};

export function useEditSubCaste({
  subCasteId,
  options = {},
}: UseEditSubCasteArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: subCasteKeys.edit(subCasteId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditSubCasteApiResponse>(
        SUB_CASTE_ROUTES.patch(subCasteId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
