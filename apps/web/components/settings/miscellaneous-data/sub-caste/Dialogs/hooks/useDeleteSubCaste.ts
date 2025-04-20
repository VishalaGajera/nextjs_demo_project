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
import { SUB_CASTE_ROUTES } from "../../../../../../constants/routes/settings/sub-caste/routes";

type DeleteSubCasteApiResponse = ApiSuccessResponse<SubCaste>;

type UseDeleteSubCasteArgs = {
  options: UseMutationOptions<DeleteSubCasteApiResponse, ApiErrorResponse>;
  subCasteId: string;
};

export function useDeleteSubCaste({
  subCasteId,
  options = {},
}: UseDeleteSubCasteArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: subCasteKeys.delete(subCasteId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteSubCasteApiResponse>(
        SUB_CASTE_ROUTES.delete(subCasteId)
      );

      return data;
    },
    ...options,
  });
}
