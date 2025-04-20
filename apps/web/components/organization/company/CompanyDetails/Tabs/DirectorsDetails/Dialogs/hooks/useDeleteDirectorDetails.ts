"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { directorDetailsKeys } from "../../../../../../../../queryKeysFactories/directorDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { DirectorDetails } from "../../DirectorDetailsCard/hooks/useGetDirectorsDetails";
import { DIRECTOR_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/director-details/routes";

type DeleteDirectorDetailApiResponse = ApiSuccessResponse<DirectorDetails>;

type UseDeleteDirectorDetailArgs = {
  options: UseMutationOptions<
    DeleteDirectorDetailApiResponse,
    ApiErrorResponse
  >;
  directorDetailId: string;
  companyId: string;
};

export function useDeleteDirectorDetail({
  directorDetailId,
  companyId,
  options = {},
}: UseDeleteDirectorDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: directorDetailsKeys.delete(directorDetailId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteDirectorDetailApiResponse>(
          DIRECTOR_DETAILS_ROUTES.delete(companyId, directorDetailId)
        );

      return data;
    },
    ...options,
  });
}
