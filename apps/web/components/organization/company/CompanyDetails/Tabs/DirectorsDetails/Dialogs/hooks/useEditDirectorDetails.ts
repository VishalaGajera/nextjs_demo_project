"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { directorDetailsKeys } from "../../../../../../../../queryKeysFactories/directorDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { DirectorDetails } from "../../DirectorDetailsCard/hooks/useGetDirectorsDetails";
import type { DirectorDetailFormFieldValues } from "../DirectorDetailsForm";
import { DIRECTOR_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/director-details/routes";

type useEditDirectorDetailApiResponse = ApiSuccessResponse<DirectorDetails>;

type UseEditDirectorDetailArgs = {
  options: UseMutationOptions<
    useEditDirectorDetailApiResponse,
    ApiErrorResponse<DirectorDetailFormFieldValues>,
    Partial<DirectorDetailFormFieldValues>
  >;
  directorDetailId: string | null;
  companyId: string;
};

export function useEditDirectorDetail({
  companyId,
  directorDetailId,
  options = {},
}: UseEditDirectorDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: directorDetailsKeys.edit(directorDetailId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<useEditDirectorDetailApiResponse>(
          DIRECTOR_DETAILS_ROUTES.patch(companyId, directorDetailId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
