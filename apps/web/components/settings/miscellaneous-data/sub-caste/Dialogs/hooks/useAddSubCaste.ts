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

type AddSubCasteApiSuccessResponse = ApiSuccessResponse<SubCaste>;

type UseAddSubCasteArgs = {
  options: UseMutationOptions<
    AddSubCasteApiSuccessResponse,
    ApiErrorResponse<SubCasteFormFieldValues>,
    Partial<SubCasteFormFieldValues>
  >;
};

export function useAddSubCaste({ options = {} }: UseAddSubCasteArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: subCasteKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddSubCasteApiSuccessResponse>(
        SUB_CASTE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
