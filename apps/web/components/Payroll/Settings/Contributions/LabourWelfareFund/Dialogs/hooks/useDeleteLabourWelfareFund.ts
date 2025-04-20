"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LWF_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/contributions/lwf-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { labourWelfareFundKeys } from "../../../../../../../queryKeysFactories/labourWelfareFund";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LabourWelfareFund } from "../../LabourWelfareFundListing/hooks/useListLabourWelfareFund";

type DeleteLabourWelfareFundApiResponse = ApiSuccessResponse<LabourWelfareFund>;

type UseDeleteLabourWelfareFundArgs = {
  options: UseMutationOptions<
    DeleteLabourWelfareFundApiResponse,
    ApiErrorResponse
  >;
  lwfGroupId: string;
};

export function useDeleteLabourWelfareFund({
  lwfGroupId,
  options = {},
}: UseDeleteLabourWelfareFundArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: labourWelfareFundKeys.delete(lwfGroupId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteLabourWelfareFundApiResponse>(
          LWF_GROUP_ROUTES.delete(lwfGroupId)
        );

      return data;
    },
    ...options,
  });
}
