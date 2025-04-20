"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { designationKeys } from "../../../../../../queryKeysFactories/designation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Designation } from "../../DesignationList/hooks/useDesignations";
import { DESIGNATION_ROUTES } from "../../../../../../constants/routes/settings/designation/routes";

type DeleteDesignationApiResponse = ApiSuccessResponse<Designation>;

type UseDeleteDesignationArgs = {
  options: UseMutationOptions<DeleteDesignationApiResponse, ApiErrorResponse>;
  designationId: string;
};

export function useDeleteDesignation({
  designationId,
  options = {},
}: UseDeleteDesignationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: designationKeys.delete(designationId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteDesignationApiResponse>(
        DESIGNATION_ROUTES.delete(designationId)
      );

      return data;
    },
    ...options,
  });
}
